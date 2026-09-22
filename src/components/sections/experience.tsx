import { experience } from "@/data/experience";
import { Section } from "../ui/section";
import { Reveal } from "../ui/reveal";

export function Experience() {
  return (
    <Section id="experience" label="experience" heading="The journey so far">
      <div className="relative">
        {/* The rail runs behind the dots. Masking it with an opaque disc
            doesn't work here — the ambient bloom sits behind the page, so a
            solid --bg circle is visibly lighter than its surroundings and
            reads as a notch in the line. */}
        <span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[7px] w-px"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--line-strong) 10%, var(--line-strong) 90%, transparent)",
          }}
        />

        {/* A flex row rather than absolute positioning: the marker can't drift
            onto the text the way an absolutely positioned one did once its
            containing block changed. */}
        <ol className="space-y-12">
          {experience.map((item, index) => (
            <li key={item.title} className="flex gap-5">
              <span
                aria-hidden="true"
                /* `relative` matters: the rail is absolutely positioned, so
                   it paints above static siblings no matter the DOM order.
                   Positioning the marker puts it back on top of the line. */
                className="relative mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center"
              >
                <span className="h-2 w-2 rounded-full bg-accent" />
              </span>

              <Reveal delay={index * 0.08} className="min-w-0 flex-1">
                <p className="mb-2 font-mono text-xs tracking-wide text-accent">
                  {item.period}
                </p>

                <h3 className="text-xl font-semibold">{item.title}</h3>

                <p className="mt-2 max-w-xl leading-relaxed text-muted">
                  {item.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
