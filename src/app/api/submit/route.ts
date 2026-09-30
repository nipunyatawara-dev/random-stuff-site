import { NextResponse } from "next/server";
import { getItems } from "@/lib/items-server";

const ALLOWED_CATEGORIES = ["Websites", "Softwares", "Scripts"] as const;
const TOOL_NAME_MAX_LENGTH = 80;
const LINK_MAX_LENGTH = 500;
const DESCRIPTION_MAX_LENGTH = 500;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RECENT_SUBMISSION_TTL_MS = 24 * 60 * 60 * 1000;

interface Submission {
    toolName: string;
    link: string;
    category: (typeof ALLOWED_CATEGORIES)[number];
    description: string;
    submittedAt: string;
}

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
const recentSubmittedUrls = new Map<string, number>();
const recentSubmittedNames = new Map<string, number>();

function getClientIp(request: Request) {
    return (
        request.headers.get("x-vercel-ip") ||
        request.headers.get("x-real-ip") ||
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown"
    );
}

function checkRateLimit(identifier: string) {
    const now = Date.now();

    if (rateLimitStore.size > 1000) {
        for (const [key, entry] of rateLimitStore) {
            if (entry.resetAt <= now) rateLimitStore.delete(key);
        }
    }

    const current = rateLimitStore.get(identifier);

    if (!current || current.resetAt <= now) {
        rateLimitStore.set(identifier, {
            count: 1,
            resetAt: now + RATE_LIMIT_WINDOW_MS,
        });
        return { allowed: true, retryAfterSeconds: 0 };
    }

    if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
        return {
            allowed: false,
            retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
        };
    }

    current.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
}

function pruneRecentSubmissions() {
    const now = Date.now();

    if (recentSubmittedUrls.size > 1000) {
        for (const [url, expiresAt] of recentSubmittedUrls) {
            if (expiresAt <= now) recentSubmittedUrls.delete(url);
        }
    }

    if (recentSubmittedNames.size > 1000) {
        for (const [name, expiresAt] of recentSubmittedNames) {
            if (expiresAt <= now) recentSubmittedNames.delete(name);
        }
    }
}

function normalizeName(value: string) {
    return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function normalizeUrlForDuplicateCheck(value: string) {
    const url = new URL(value);
    url.protocol = url.protocol.toLowerCase();
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    url.hash = "";

    if (
        (url.protocol === "https:" && url.port === "443") ||
        (url.protocol === "http:" && url.port === "80")
    ) {
        url.port = "";
    }

    for (const key of [...url.searchParams.keys()]) {
        if (
            key.toLowerCase().startsWith("utm_") ||
            ["fbclid", "gclid", "ref", "source", "tab"].includes(key.toLowerCase())
        ) {
            url.searchParams.delete(key);
        }
    }

    const normalizedPath = url.pathname.replace(/\/+$/, "") || "/";
    url.pathname = normalizedPath;

    return url.toString().replace(/\/$/, "");
}

function isAllowedCategory(value: string): value is Submission["category"] {
    return ALLOWED_CATEGORIES.includes(value as Submission["category"]);
}

async function findExistingDuplicate(normalizedName: string, normalizedUrl: string) {
    const items = await getItems();

    return items.find((item) => {
        const titleMatches = normalizeName(item.title) === normalizedName;
        const urls = [item.website, item.github].filter(Boolean) as string[];
        const urlMatches = urls.some((url) => {
            try {
                return normalizeUrlForDuplicateCheck(url) === normalizedUrl;
            } catch {
                return false;
            }
        });

        return titleMatches || urlMatches;
    });
}

async function sendToDiscord(submission: {
    toolName: string;
    link: string;
    category: string;
    description: string;
}) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.error("DISCORD_WEBHOOK_URL is not set");
        return false;
    }

    const embed = {
        title: "New Tool Submission",
        color: 0xa3e635,
        fields: [
            { name: "Tool Name", value: submission.toolName, inline: true },
            { name: "Category", value: submission.category, inline: true },
            { name: "Link", value: submission.link },
            { name: "Description", value: submission.description },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "Random Stuff Site | Tool Submission" },
    };

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                embeds: [embed],
                allowed_mentions: { parse: [] },
            }),
        });

        return response.ok;
    } catch (error) {
        console.error("Discord webhook error:", error);
        return false;
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Submissions are delivered to Discord and are not stored locally.",
    });
}

export async function POST(request: Request) {
    try {
        const clientIp = getClientIp(request);
        const rateLimit = checkRateLimit(clientIp);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                { error: "Too many submissions. Please try again later." },
                {
                    status: 429,
                    headers: {
                        "Retry-After": String(rateLimit.retryAfterSeconds),
                    },
                }
            );
        }

        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid submission payload." },
                { status: 400 }
            );
        }

        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { error: "Invalid submission payload." },
                { status: 400 }
            );
        }

        const payload = body as Record<string, unknown>;
        const { toolName, link, category, description, honeypot } = payload;

        // Reject if honeypot is populated
        if (typeof honeypot === "string" && honeypot.trim().length > 0) {
            return NextResponse.json(
                { error: "Submission rejected." },
                { status: 400 }
            );
        }

        const trimmedName = typeof toolName === "string" ? toolName.trim() : "";
        const trimmedLink = typeof link === "string" ? link.trim() : "";
        const trimmedCategory = typeof category === "string" ? category.trim() : "";
        const trimmedDescription =
            typeof description === "string" ? description.trim() : "";

        if (!trimmedName || !trimmedLink || !trimmedCategory || !trimmedDescription) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        if (trimmedName.length > TOOL_NAME_MAX_LENGTH) {
            return NextResponse.json(
                { error: `Tool name must be ${TOOL_NAME_MAX_LENGTH} characters or fewer.` },
                { status: 400 }
            );
        }

        if (trimmedLink.length > LINK_MAX_LENGTH) {
            return NextResponse.json(
                { error: `URL must be ${LINK_MAX_LENGTH} characters or fewer.` },
                { status: 400 }
            );
        }

        if (trimmedDescription.length > DESCRIPTION_MAX_LENGTH) {
            return NextResponse.json(
                { error: `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.` },
                { status: 400 }
            );
        }

        if (!isAllowedCategory(trimmedCategory)) {
            return NextResponse.json(
                { error: "Please choose a valid category." },
                { status: 400 }
            );
        }

        let parsedLink: URL;
        try {
            parsedLink = new URL(trimmedLink);
        } catch {
            return NextResponse.json(
                { error: "Please enter a valid URL." },
                { status: 400 }
            );
        }

        if (!["http:", "https:"].includes(parsedLink.protocol)) {
            return NextResponse.json(
                { error: "Only HTTP(S) URLs are allowed." },
                { status: 400 }
            );
        }

        const normalizedName = normalizeName(trimmedName);
        const normalizedUrl = normalizeUrlForDuplicateCheck(parsedLink.toString());
        const existingItem = await findExistingDuplicate(normalizedName, normalizedUrl);

        if (existingItem) {
            return NextResponse.json(
                { error: "This tool already exists in our directory!" },
                { status: 409 }
            );
        }

        pruneRecentSubmissions();

        if (
            recentSubmittedUrls.has(normalizedUrl) ||
            recentSubmittedNames.has(normalizedName)
        ) {
            return NextResponse.json(
                { error: "This tool has already been submitted recently." },
                { status: 409 }
            );
        }

        const submission: Submission = {
            toolName: trimmedName,
            link: parsedLink.toString(),
            category: trimmedCategory,
            description: trimmedDescription,
            submittedAt: new Date().toISOString(),
        };

        const discordSuccess = await sendToDiscord({
            toolName: submission.toolName,
            link: submission.link,
            category: submission.category,
            description: submission.description,
        });

        if (!discordSuccess) {
            return NextResponse.json(
                { error: "Submission could not be delivered. Please try again later." },
                { status: 502 }
            );
        }

        const expiresAt = Date.now() + RECENT_SUBMISSION_TTL_MS;
        recentSubmittedUrls.set(normalizedUrl, expiresAt);
        recentSubmittedNames.set(normalizedName, expiresAt);

        return NextResponse.json(
            {
                message: "Submission received!",
                submission,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating submission:", error);
        return NextResponse.json(
            { error: "Failed to create submission" },
            { status: 500 }
        );
    }
}
