import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { StructuredData } from "@/components/structured-data";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { Skills } from "@/components/sections/skills";
import { Work } from "@/components/sections/work";

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <Nav />

      {/* Work sits directly under the hero: a visitor who leaves after eight
          seconds should have seen a project, not a list of editors. */}
      <main id="main">
        <Hero />
        <Work />
        <About />
        <Experience />
        <Skills />
        <Process />
        <Faq />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
