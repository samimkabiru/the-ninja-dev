import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line/60">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-10 text-xs text-faint">
        <span className="font-mono">{siteConfig.handle}</span>
        <span className="font-mono">built with Next.js &amp; Tailwind</span>
        <span>
          © {new Date().getFullYear()} {siteConfig.name}
        </span>
      </div>
    </footer>
  );
}
