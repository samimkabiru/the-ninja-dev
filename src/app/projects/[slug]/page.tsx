import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProject, projects } from "@/data/projects";
import { siteConfig } from "@/data/site";
import { CaseStudy, CaseStudyActions } from "@/components/case-study";
import { Footer } from "@/components/footer";

type Params = { params: Promise<{ slug: string }> };

/** Every case study is prerendered at build time. */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Project not found" };

  const url = `${siteConfig.url}/projects/${project.slug}`;

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      url,
      title: `${project.title} — ${siteConfig.name}`,
      description: project.summary,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${siteConfig.name}`,
      description: project.summary,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  return (
    <>
      <header className="sticky top-0 z-30 glass">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-6">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
          >
            <ArrowLeft size={15} aria-hidden="true" /> All work
          </Link>

          <span className="font-mono text-sm font-medium">
            {siteConfig.handle}
          </span>
        </div>
      </header>

      <main className="pt-12">
        <CaseStudy project={project} />

        <div className="mx-auto max-w-3xl px-6 pb-20">
          <CaseStudyActions project={project} />
        </div>
      </main>

      <Footer />
    </>
  );
}
