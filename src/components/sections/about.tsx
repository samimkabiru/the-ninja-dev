import Image from "next/image";
import { siteConfig } from "@/data/site";
import { Section } from "../ui/section";
import { Reveal } from "../ui/reveal";

export function About() {
  return (
    <Section
      id="about"
      label="about"
      heading="From concept to shipped product"
      tone="sunken"
    >
      <Reveal className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Portrait />

        <div>
          <p className="font-display text-2xl leading-snug">
            I build the whole thing — interface, API, database — so nothing
            gets lost in the handoff.
          </p>

          <div className="mt-6 space-y-4 text-muted">
            <p className="leading-relaxed">
              For nearly two years I&apos;ve worked across the full stack,
              building modern, scalable, user-friendly web applications for real
              clients and products. On the frontend that means React, Next.js,
              and TypeScript, styled with Tailwind CSS and shadcn/ui. On the
              backend, Java and Spring Boot power the REST APIs and server-side
              systems underneath.
            </p>
            <p className="leading-relaxed">
              What I enjoy most is owning the whole path — designing the
              interface, building it out, connecting it to a database and any
              APIs it needs, and bringing all of it together into something
              complete.
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/**
 * Holds a real photo the moment `siteConfig.portrait` is filled in. Until
 * then it shows a monogram card, which reads as a deliberate mark rather than
 * a missing image.
 */
function Portrait() {
  const initials = siteConfig.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div className="relative mx-auto w-full max-w-[280px] lg:mx-0">
      <div className="card overflow-hidden rounded-2xl">
        <div
          className="relative aspect-square"
          style={{
            background:
              "linear-gradient(150deg, color-mix(in srgb, var(--accent) 16%, transparent), transparent 60%)",
          }}
        >
          {siteConfig.portrait ? (
            <Image
              src={siteConfig.portrait.src}
              alt={siteConfig.portrait.alt}
              fill
              sizes="280px"
              className="object-cover"
            />
          ) : (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, var(--dot-grid) 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center font-display text-6xl font-semibold text-accent opacity-30"
              >
                {initials}
              </span>
            </>
          )}
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-[11px] text-faint lg:text-left">
        {siteConfig.location}
      </p>
    </div>
  );
}
