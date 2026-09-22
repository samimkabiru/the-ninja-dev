import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/data/site";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

/*
 * Fonts are vendored into the repo (src/app/fonts) and served from your own
 * origin rather than pulled from Google at runtime: no third-party request on
 * every page load, no GDPR question, the build works offline, and
 * `adjustFontFallback` sizes the system fallback to match so text doesn't
 * jump while the webfont loads. Variable fonts — one file per family.
 */
const inter = localFont({
  src: "./fonts/inter-variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
  adjustFontFallback: "Arial",
});

const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-variable.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--font-display",
  adjustFontFallback: "Arial",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-variable.woff2",
  weight: "100 800",
  display: "swap",
  variable: "--font-mono",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  keywords: [
    "full-stack developer",
    "React developer",
    "Next.js developer",
    "Spring Boot developer",
    "Java developer",
    "freelance developer Nigeria",
    `${siteConfig.locality} web developer`,
    `web developer ${siteConfig.locality}`,
    siteConfig.name,
    siteConfig.handle,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0908" },
  ],
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`no-js ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Runs before paint so the theme class is already correct. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-bg text-fg antialiased">
        {/* Ambient colour behind everything — also what the glass refracts. */}
        <div className="bloom-field" aria-hidden="true" />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-fg"
        >
          Skip to content
        </a>

        {children}
        {modal}
      </body>
    </html>
  );
}
