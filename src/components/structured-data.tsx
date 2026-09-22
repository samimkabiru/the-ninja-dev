import { projects } from "@/data/projects";
import { faqs } from "@/data/faqs";
import { siteConfig } from "@/data/site";

/**
 * JSON-LD so search engines can read who you are and what you've built,
 * rather than inferring it from the markup. Each case study now has its own
 * URL, so they're linked as real works rather than anonymous entries.
 */
export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.name,
        alternateName: siteConfig.handle,
        url: siteConfig.url,
        email: `mailto:${siteConfig.email}`,
        jobTitle: siteConfig.role,
        // Read from the config rather than hardcoded, so the page copy and
        // the structured data can't drift apart.
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.locality,
          addressCountry: siteConfig.country,
        },
        sameAs: Object.values(siteConfig.links).filter(Boolean),
        knowsAbout: [
          "React",
          "Next.js",
          "TypeScript",
          "Java",
          "Spring Boot",
          "PostgreSQL",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.title,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#person` },
      },
      ...projects.map((project) => ({
        "@type": "CreativeWork",
        "@id": `${siteConfig.url}/projects/${project.slug}#work`,
        url: `${siteConfig.url}/projects/${project.slug}`,
        name: project.title,
        description: project.summary,
        author: { "@id": `${siteConfig.url}/#person` },
        keywords: project.tags.join(", "),
        ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
      })),
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
