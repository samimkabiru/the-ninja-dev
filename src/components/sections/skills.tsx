import { skillGroups, uses } from "@/data/skills";
import { cn } from "@/lib/utils";
import { Section } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { TechIcon } from "../ui/tech-icon";

/**
 * The old standalone "Uses" section sat between Skills and Projects — seven
 * cards about editors, immediately before the work. It lives here now as a
 * quiet one-line footnote instead of its own full section.
 */
export function Skills() {
  return (
    <Section
      id="skills"
      label="skills"
      heading="Tools I build with"
      tone="sunken"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <Reveal
            key={group.group}
            delay={index * 0.06}
            className={cn("h-full", group.wide && "lg:col-span-2")}
          >
            <div className="card h-full p-6">
              <p className="mb-6 font-mono text-xs text-faint">
                <span className="text-accent" aria-hidden="true">
                  {"//"}
                </span>{" "}
                {group.group}
              </p>

              <ul
                className={cn(
                  // The wide card keeps four columns so its icons spread
                  // across the full width instead of bunching up on the left.
                  "grid grid-cols-4 gap-x-2 gap-y-6",
                )}
              >
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="group flex flex-col items-center gap-2"
                  >
                    <TechIcon
                      name={item}
                      size={30}
                      className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-110"
                    />
                    <span className="text-center font-mono text-[10px] leading-tight text-muted">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl px-6 py-5 shadow-[var(--ring)]">
          <p className="font-mono text-xs text-faint">
            <span className="text-accent" aria-hidden="true">
              {"//"}
            </span>{" "}
            day to day
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {uses.map((item) => (
              <li key={item.name} className="flex items-center gap-2">
                <TechIcon name={item.name} size={16} />
                <span className="text-sm text-muted">{item.name}</span>
                <span className="font-mono text-[10px] text-faint">
                  {item.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
