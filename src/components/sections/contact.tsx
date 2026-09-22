import { Github, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/data/site";
import { Section } from "../ui/section";
import { Reveal } from "../ui/reveal";
import { ContactForm } from "../contact-form";

export function Contact() {
  return (
    <Section
      id="contact"
      label="contact"
      heading="Let's build something"
      intro="Have a project in mind, or just want to talk shop? I'm always open to a conversation."
    >
      <Reveal>
        <div className="card grid gap-10 p-6 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="space-y-3">
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 shadow-[var(--ring)] transition-colors hover:bg-surface-alt"
            >
              <Mail size={17} className="text-accent" aria-hidden="true" />
              <span className="font-mono text-sm break-all">
                {siteConfig.email}
              </span>
            </a>

            {siteConfig.links.github ? (
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 shadow-[var(--ring)] transition-colors hover:bg-surface-alt"
              >
                <Github size={17} className="text-accent" aria-hidden="true" />
                <span className="font-mono text-sm">GitHub</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}

            <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 shadow-[var(--ring)]">
              <MapPin size={17} className="text-accent" aria-hidden="true" />
              <span className="font-mono text-sm">{siteConfig.location}</span>
            </div>

            <p className="pt-2 text-sm leading-relaxed text-muted">
              Working remotely with clients anywhere. Replies usually land
              within a day.
            </p>
          </div>

          <ContactForm />
        </div>
      </Reveal>
    </Section>
  );
}
