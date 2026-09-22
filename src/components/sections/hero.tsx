import { ArrowDown, Download } from "lucide-react";
import { siteConfig } from "@/data/site";
import { TerminalCard } from "../terminal-card";

export function Hero() {
  return (
    <section id="hero" className="relative scroll-mt-24 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--dot-grid) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(70% 60% at 30% 20%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(70% 60% at 30% 20%, black, transparent)",
        }}
      />

      <div className="relative mx-auto grid max-w-5xl items-center gap-12 px-6 pt-14 pb-20 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <div className="mb-7 flex flex-wrap gap-2">
            {siteConfig.availableForWork ? (
              <p className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs text-muted">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                available for freelance work
              </p>
            ) : null}

            {/* items-baseline, not items-center: this label is long enough to
                wrap on a phone, and a centred prompt against two lines of text
                reads as a mistake. */}
            <p className="glass inline-flex items-baseline gap-2 rounded-full px-3.5 py-1.5 font-mono text-xs text-muted">
              <span className="text-accent" aria-hidden="true">
                $
              </span>
              currently: {siteConfig.currentlyBuilding}
            </p>
          </div>

          <p className="mb-3 font-mono text-sm text-accent">
            {siteConfig.role} · {siteConfig.location}
          </p>

          <h1 className="text-[clamp(2.75rem,7vw,4.25rem)] leading-[0.98] font-semibold">
            {siteConfig.name}
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            I take products from a blank page to something people actually
            use — designing the interface, building the frontend, and wiring up
            the backend that runs it.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-fg shadow-soft-md transition-transform hover:-translate-y-0.5"
            >
              See the work <ArrowDown size={15} aria-hidden="true" />
            </a>

            <a
              href="#contact"
              className="rounded-full px-6 py-3 text-sm font-medium shadow-[var(--ring)] transition-colors hover:bg-surface"
            >
              Start a project
            </a>

            {siteConfig.resumePath ? (
              <a
                href={siteConfig.resumePath}
                download
                className="inline-flex items-center gap-1.5 rounded-full px-5 py-3 font-mono text-sm text-muted transition-colors hover:text-accent"
              >
                <Download size={14} aria-hidden="true" /> Résumé
              </a>
            ) : null}
          </div>

          {/* Proof row — three facts before anyone has to scroll. */}
          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
            {siteConfig.highlights.map((item) => (
              <div key={item.label}>
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-semibold">
                    {item.value}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] text-faint">
                    {item.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <TerminalCard />
      </div>
    </section>
  );
}
