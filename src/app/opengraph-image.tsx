import { ImageResponse } from "next/og";
import { items } from "@/data/items";

export const runtime = "nodejs";

export const alt = "Random Stuff - Curated Directory for Builders";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const totalCount = items.length;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#0b1b2b",
          backgroundImage:
            "radial-gradient(circle at 50% 10%, #1a3a5a 0%, #0b1b2b 70%)",
          padding: "56px 64px",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle Decorative Ambient Glows */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "300px",
            background: "radial-gradient(circle, rgba(157, 247, 31, 0.15) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        {/* Top Header Pill Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Logo Brand Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            {/* Otter Mascot Badge */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "20px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
                <circle cx="28" cy="28" r="9" fill="#14334D" />
                <circle cx="28" cy="28" r="5" fill="#89E00F" />
                <circle cx="72" cy="28" r="9" fill="#14334D" />
                <circle cx="72" cy="28" r="5" fill="#89E00F" />
                <ellipse cx="50" cy="46" rx="28" ry="24" fill="#14334D" />
                <ellipse cx="50" cy="52" rx="13" ry="9" fill="#FAFCFD" />
                <path d="M46 47 C48 45, 52 45, 54 47 C54 50, 46 50, 46 47 Z" fill="#14334D" />
                <circle cx="39" cy="41" r="9.5" stroke="#89E00F" strokeWidth="3" fill="#14334D" />
                <circle cx="61" cy="41" r="9.5" stroke="#89E00F" strokeWidth="3" fill="#14334D" />
                <path d="M48.5 41 Q50 39 51.5 41" stroke="#89E00F" strokeWidth="3" strokeLinecap="round" />
                <circle cx="39" cy="41" r="4.5" fill="#FFFFFF" />
                <circle cx="39.5" cy="41" r="2.5" fill="#14334D" />
                <circle cx="61" cy="41" r="4.5" fill="#FFFFFF" />
                <circle cx="60.5" cy="41" r="2.5" fill="#14334D" />
              </svg>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                }}
              >
                RANDOM STUFF
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "monospace",
                  letterSpacing: "0.15em",
                  color: "#89E00F",
                  textTransform: "uppercase",
                }}
              >
                Curated Builder Directory
              </span>
            </div>
          </div>

          {/* Live Count Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(157, 247, 31, 0.15)",
              border: "1px solid rgba(157, 247, 31, 0.4)",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                backgroundColor: "#9DF71F",
              }}
            />
            <span
              style={{
                fontSize: "15px",
                fontFamily: "monospace",
                fontWeight: 800,
                color: "#9DF71F",
                letterSpacing: "0.05em",
              }}
            >
              {totalCount}+ TOOLS INDEXED
            </span>
          </div>
        </div>

        {/* Center Hero Message */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "960px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.04em",
              color: "#FFFFFF",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            The directory for builders who can&apos;t afford to waste time.
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: 500,
              lineHeight: 1.4,
              color: "#9ab3c9",
              maxWidth: "760px",
            }}
          >
            A high-taste catalog of useful websites, desktop apps, and CLI scripts.
            Handpicked daily with zero sponsored noise.
          </div>
        </div>

        {/* Bottom Feature Badges & Domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                fontSize: "14px",
                fontWeight: 600,
                color: "#d0e0ed",
              }}
            >
              Websites • Softwares • Scripts
            </div>

            <div
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                backgroundColor: "rgba(0, 123, 229, 0.15)",
                border: "1px solid rgba(0, 123, 229, 0.35)",
                fontSize: "14px",
                fontWeight: 600,
                color: "#82CCFF",
              }}
            >
              100% Free Forever
            </div>

            <div
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                backgroundColor: "rgba(157, 247, 31, 0.1)",
                border: "1px solid rgba(157, 247, 31, 0.3)",
                fontSize: "14px",
                fontWeight: 600,
                color: "#9DF71F",
              }}
            >
              No Ads / No Affiliate Traps
            </div>
          </div>

          <div
            style={{
              fontSize: "18px",
              fontFamily: "monospace",
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "0.04em",
            }}
          >
            randomstuff.shocka.site
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
