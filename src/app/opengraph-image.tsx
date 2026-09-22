import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time, so link previews on X, LinkedIn and WhatsApp show
 * a real card instead of a bare URL. Edit the markup here to change it — no
 * design tool needed.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0c0a09",
          color: "#f5f5f4",
        }}
      >
        <div style={{ display: "flex", color: "#34d399", fontSize: 30 }}>
          {"</> "}
          {siteConfig.handle}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            marginTop: 28,
            letterSpacing: "-0.02em",
          }}
        >
          {siteConfig.name}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 34,
            color: "#a8a29e",
            marginTop: 20,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          {siteConfig.role} · React, Next.js, Java &amp; Spring Boot ·{" "}
          {siteConfig.location}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            height: 6,
            width: 180,
            background: "#34d399",
          }}
        />
      </div>
    ),
    size,
  );
}
