import { processSteps } from "@/data/process";
import { Section } from "../ui/section";
import { Reveal } from "../ui/reveal";

export function Process() {
  return (
    <Section
      id="process"
      label="process"
      heading="How I work"
      intro="Four steps, start to finish — so you always know what happens next."
    >
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => (
          <li key={step.step}>
            <Reveal delay={index * 0.08} className="h-full">
              <article className="card relative h-full overflow-hidden p-6">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--accent), transparent)",
                  }}
                />

                <div className="flex items-center justify-between">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--accent) 12%, transparent)",
                    }}
                  >
                    <step.icon size={17} className="text-accent" />
                  </span>

                  <span className="font-mono text-xs text-faint">
                    {step.step}
                  </span>
                </div>

                <h3 className="mt-5 text-base font-semibold">{step.title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
