import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { Section } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { Tag } from "../ui/tag";
import { ProjectThumb } from "../ui/project-thumb";

/**
 * The first project gets a wide feature row and the rest sit in a grid — so
 * the section has a focal point instead of three identical boxes, and the
 * strongest piece of work is the one that reads first.
 */
export function Work() {
  const [featured, ...rest] = projects;

  return (
    <Section
      id="work"
      label="selected work"
      heading="Things I've built and shipped"
      intro="Each one opens as a case study: the problem, what I did about it, and what actually shipped."
    >
      {featured ? (
        <Reveal>
          <FeaturedCard project={featured} />
        </Reveal>
      ) : null}

      <ul className="mt-6 grid gap-6 sm:grid-cols-2">
        {rest.map((project, index) => (
          <li key={project.slug}>
            <Reveal delay={0.08 + index * 0.08} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <article className="group card card-hover relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <ProjectThumb project={project} />

      <div>
        <p className="font-mono text-[11px] tracking-wide text-accent">
          featured
        </p>

        <h3 className="mt-3 text-2xl font-semibold">
          {/* scroll={false}: this opens as an overlay, so the page behind it
              must stay exactly where the visitor left it. Without this Next
              scrolls to the top on navigation, and `scroll-behavior: smooth`
              makes you watch it happen. */}
          <Link
            href={`/projects/${project.slug}`}
            scroll={false}
            className="before:absolute before:inset-0 before:content-['']"
          >
            {project.title}
            <span className="sr-only"> — read the case study</span>
          </Link>
        </h3>

        <p className="mt-3 leading-relaxed text-muted">{project.summary}</p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag name={tag} />
            </li>
          ))}
        </ul>

        <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          Read the case study
          <ArrowUpRight
            size={15}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </p>
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group card card-hover relative flex h-full flex-col p-5">
      <ProjectThumb project={project} />

      <div className="flex flex-1 flex-col pt-5">
        <h3 className="text-lg font-semibold">
          <Link
            href={`/projects/${project.slug}`}
            scroll={false}
            className="before:absolute before:inset-0 before:content-['']"
          >
            {project.title}
            <span className="sr-only"> — read the case study</span>
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {project.blurb}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Tag name={tag} />
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
