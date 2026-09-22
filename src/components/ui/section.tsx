import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  /** The lowercase `// label` above the heading. */
  label: string;
  heading: string;
  /** Optional line of copy under the heading. */
  intro?: string;
  /** Rendered on the right of the heading row — usually a link. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Sits on a slightly sunken surface, to break up the rhythm. */
  tone?: "default" | "sunken";
};

/**
 * Every content section shares this shell, so the vertical rhythm is defined
 * once. The dividing borders are gone — spacing and the occasional sunken
 * band separate sections now, which is quieter than nine hairlines.
 */
export function Section({
  id,
  label,
  heading,
  intro,
  action,
  children,
  className,
  tone = "default",
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        "scroll-mt-24",
        tone === "sunken" && "bg-surface-sunken/60",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mb-4 font-mono text-xs tracking-wide">
              <span className="text-accent" aria-hidden="true">
                {"//"}
              </span>{" "}
              <span className="text-faint">{label}</span>
            </p>

            <h2
              id={headingId}
              className="text-3xl leading-[1.1] font-semibold sm:text-[2.6rem]"
            >
              {heading}
            </h2>

            {intro ? (
              <p className="mt-4 text-base leading-relaxed text-muted">
                {intro}
              </p>
            ) : null}
          </div>

          {action}
        </div>

        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}
