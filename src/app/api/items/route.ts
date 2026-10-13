import { NextResponse } from "next/server";
import { getItems } from "@/lib/items-server";

// The bundled catalog only changes on deployment.
export const dynamic = "force-static";

export async function GET() {
    const items = await getItems();
    const sorted = [...items].sort((a, b) => a.title.localeCompare(b.title));
    return NextResponse.json(sorted, {
        headers: {
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
