import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import { getAdjacent, type Project } from "@/data/projects";
import { ProjectThumb } from "./ui/project-thumb";
import { ProjectVideo } from "./ui/project-video";
import { Tag } from "./ui/tag";

/** Live / code buttons. Shared by the page and the overlay's sticky footer. */
export function CaseStudyActions({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  const repos = project.repos ?? [];

  if (!project.liveUrl && repos.length === 0) {
    return (
      <p className="font-mono text-xs text-faint">
        Private project — happy to walk through it on a call.
      </p>
    );
  }

  return (
    <div className={compact ? "flex flex-wrap justify-end gap-2" : "flex flex-wrap gap-3"}>
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium whitespace-nowrap text-primary-fg shadow-soft-md transition-transform hover:-translate-y-0.5"
        >
          <ExternalLink size={14} aria-hidden="true" /> View live
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : null}

      {repos.map((repo) => (
        <a
          key={repo.url}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap shadow-[var(--ring)] transition-colors hover:bg-surface-alt"
        >
          <Github size={14} aria-hidden="true" />
          {repo.label ?? "Source"}
          <span className="sr-only">
            {repo.label ? ` source code` : ""} (opens in a new tab)
          </span>
        </a>
      ))}
    </div>
  );
}

/**
 * The case study itself, with no surrounding chrome — so the standalone route
 * and the intercepted overlay render exactly the same content and can never
 * drift apart.
 */
export function CaseStudy({
  project,
  variant = "page",
}: {
  project: Project;
  variant?: "page" | "overlay";
}) {
  const { previous, next } = getAdjacent(project.slug);

  /*
   * Inside the overlay, prev/next REPLACE the history entry instead of
   * pushing one. Pushing grew the stack (/ → /projects/a → /projects/b …),
   * so closing — which pops a single entry — landed on the previous project
   * and reopened the overlay instead of returning to the grid.
   *
   * `scroll={false}` for the same reason the grid links use it: the page
   * behind the overlay must not jump to the top.
   */
  const inOverlay = variant === "overlay";
  const navProps = { replace: inOverlay, scroll: !inOverlay };

  const facts: Array<[string, string]> = [
    ["role", project.facts.role],
    ["timeline", project.facts.timeline],
    ["status", project.facts.status],
  ];
  if (project.facts.client) facts.push(["client", project.facts.client]);

  return (
    <article className="mx-auto max-w-3xl px-6 pb-16">
      <p className="mb-4 font-mono text-xs text-faint">
        <span className="text-accent" aria-hidden="true">
          {"//"}
        </span>{" "}
        case study
      </p>

      <h1 className="text-3xl leading-[1.1] font-semibold sm:text-5xl">
        {project.title}
      </h1>

      <p className="mt-5 text-lg leading-relaxed text-muted">
        {project.summary}
      </p>

      <ul className="mt-6 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <li key={tag}>
            <Tag name={tag} />
          </li>
        ))}
      </ul>

      {/* The big frame only appears once there's a real screenshot to put in
          it — an empty one this size would dominate the case study. Add
          `image` in src/data/projects.ts and it shows up here. */}
      {project.image ? (
        <ProjectThumb project={project} size="hero" className="mt-10" priority />
      ) : null}

      {/* Facts strip */}
      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl bg-surface-alt p-6 shadow-[var(--ring)] sm:grid-cols-4">
        {facts.map(([term, value]) => (
          <div key={term}>
            <dt className="font-mono text-[11px] tracking-wide text-faint">
              {term}
            </dt>
            <dd className="mt-1 text-sm leading-snug font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 space-y-10">
        <Block label="the problem" accent={project.accent}>
          <p className="text-base leading-relaxed text-muted">
            {project.problem}
          </p>
        </Block>

        <Block label="approach" accent={project.accent}>
          <ol className="space-y-4">
            {project.approach.map((item, index) => (
              <li key={item} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-medium"
                  style={{
                    backgroundColor: `${project.accent}1a`,
                    color: project.accent,
                  }}
                >
                  {index + 1}
                </span>
                <span className="text-base leading-relaxed text-muted">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </Block>

        {/* Sits after the approach on purpose: you've just read what was
            built, so this is where seeing it move pays off. */}
        {project.video ? (
          <Block label="in motion" accent={project.accent}>
            <ProjectVideo video={project.video} />
          </Block>
        ) : null}

        <Block label="result" accent={project.accent}>
          <p className="text-base leading-relaxed text-muted">
            {project.result}
          </p>
        </Block>
      </div>

      {/* Prev / next — browse the work without going back to the grid. */}
      <nav
        aria-label="Other projects"
        className="mt-14 grid gap-3 border-t border-line pt-8 sm:grid-cols-2"
      >
        {previous ? (
          <Link
            href={`/projects/${previous.slug}`}
            {...navProps}
            className="group card card-hover p-5"
            data-adjacent="previous"
          >
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-faint">
              <ArrowLeft size={12} aria-hidden="true" /> previous
            </span>
            <span className="mt-1.5 block font-display font-semibold">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}

        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            {...navProps}
            className="group card card-hover p-5 sm:text-right"
            data-adjacent="next"
          >
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-faint sm:justify-end">
              next <ArrowRight size={12} aria-hidden="true" />
            </span>
            <span className="mt-1.5 block font-display font-semibold">
              {next.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}

function Block({
  label,
  accent,
  children,
}: {
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 font-mono text-xs tracking-wide">
        <span aria-hidden="true" style={{ color: accent }}>
          {"//"}
        </span>{" "}
        <span className="text-faint">{label}</span>
      </h2>
      {children}
    </section>
  );
}
