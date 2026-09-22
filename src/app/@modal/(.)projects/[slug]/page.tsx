import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { ProjectOverlay } from "@/components/project-overlay";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * Intercepts /projects/[slug] when it's opened from within the site, so the
 * case study appears as an overlay over the work grid. A direct visit, a
 * refresh or a shared link still gets the full standalone page.
 */
export default async function InterceptedProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return <ProjectOverlay project={project} />;
}
