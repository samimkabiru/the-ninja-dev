/**
 * Single source of truth for everything about you.
 *
 * Anything marked `TODO` below is a placeholder — fill these in before you
 * deploy, or the links will go nowhere.
 */

export const siteConfig = {
  name: "Samim Kabiru",
  handle: "theNinjaDev",
  role: "Full-Stack Developer",
  /** Shown on the page. */
  location: "Abuja, Nigeria",
  /** City and ISO country code, for the structured data and metadata. */
  locality: "Abuja",
  country: "NG",

  title: "Samim Kabiru — Full-Stack Developer",
  description:
    "Full-stack developer in Abuja building web applications end to end — React and Next.js on the frontend, Java and Spring Boot on the backend.",

  /** No trailing slash. Override per-environment with NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://theninjadev.dev",

  email: "kabirusamimadeiza@gmail.com",

  /**
   * Rendered as "currently: <this>" in the hero, so write it as a full
   * phrase. TaskFlow is deployed now, so "building it" would contradict the
   * Live status on its case study further down the same page.
   */
  currentlyBuilding: "building Ajo — a rotating savings app",
  availableForWork: true,

  links: {
    github: "https://github.com/samimkabiru",
    // Add either of these and it appears in the contact block and in the
    // `sameAs` list search engines use to connect your profiles.
    x: "",
    linkedin: "",
  },

  /**
   * Drop your CV at `public/resume.pdf`, then change this to "/resume.pdf"
   * and the download button appears in the hero. Left null so the site never
   * ships a button that 404s.
   */
  resumePath: null as string | null,

  /**
   * The About section swaps its monogram placeholder for this. Square,
   * 800×800 or larger.
   */
  portrait: {
    src: "/me.jpg",
    alt: "Samim Kabiru, photographed head and shoulders against a tiled wall.",
  } as { src: string; alt: string } | null,

  /** Short proof points under the hero. Keep these true and current. */
  highlights: [
    { value: "2 yrs", label: "building for the web" },
    { value: "3", label: "projects shipped" },
    { value: "Remote", label: "worldwide, from Abuja" },
  ],
} as const;

export type NavItem = { label: string; id: string };

/**
 * Work comes first. A visitor who bounces after eight seconds should have
 * seen a project, not a list of editors.
 */
export const navItems: NavItem[] = [
  { label: "Work", id: "work" },
  { label: "About", id: "about" },
  { label: "Experience", id: "experience" },
  { label: "Skills", id: "skills" },
  { label: "Process", id: "process" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "contact" },
];

/** Every id the scroll-spy watches, in document order. */
export const sectionIds = [
  "hero",
  "work",
  "about",
  "experience",
  "skills",
  "process",
  "faq",
  "contact",
] as const;
