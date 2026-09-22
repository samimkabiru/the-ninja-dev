import type { TechName } from "@/lib/tech";

/**
 * A short demo clip for a case study.
 *
 * Record only what a screenshot can't show — an interaction, a handoff, a
 * thing working offline. Keep it 8–15 seconds, silent, no intro, and export
 * MP4 rather than GIF (a GIF is roughly ten times the size for worse
 * quality). Aim for under 3 MB: this loads over mobile data.
 */
export type ProjectVideo = {
  /** MP4 (H.264) — the universal fallback. */
  src: string;
  /** Optional WebM. Typically 30–50% smaller; used when supported. */
  webm?: string;
  /** Still frame shown before playback. Always set one. */
  poster?: string;
  /** What the clip shows, for anyone who can't watch it. Required. */
  caption: string;
};

export type Project = {
  /** Also the URL: /projects/<slug> */
  slug: string;
  title: string;
  /** One line, shown on the card. */
  blurb: string;
  /** A longer hook, shown at the top of the case study. */
  summary: string;
  tags: TechName[];
  /** Hex, used for the card wash and case-study accents. */
  accent: string;
  liveUrl?: string;

  /**
   * One entry per codebase. A project split across repos (an API and a
   * frontend, say) lists both — give each a short `label` and it becomes the
   * button text; omit it on a single-repo project and the button reads
   * "Source".
   */
  repos?: Array<{ url: string; label?: string }>;

  /** The facts strip at the top of the case study. */
  facts: {
    role: string;
    timeline: string;
    status: string;
    client?: string;
  };

  problem: string;
  approach: string[];
  result: string;

  /**
   * Drop a screenshot in `public/projects/` and fill this in — the card and
   * the case study both pick it up automatically. Until then a designed
   * browser-frame placeholder is shown instead.
   *
   * Give `width` and `height` in real pixels and the image renders at its own
   * aspect ratio, uncropped. Leave them out and it's cropped to a fixed box,
   * which quietly slices the edges off a wide screenshot.
   */
  image?: { src: string; alt: string; width?: number; height?: number };

  /**
   * An optional demo clip, shown inside the case study under "in motion".
   * Put files in `public/projects/`. Example:
   *
   *   video: {
   *     src: "/projects/bays-treats-order.mp4",
   *     webm: "/projects/bays-treats-order.webm",
   *     poster: "/projects/bays-treats-order.jpg",
   *     caption:
   *       "Filling the custom cake form and handing off to WhatsApp with the order details already written.",
   *   },
   */
  video?: ProjectVideo;
};

export const projects: Project[] = [
  {
    slug: "bays-treats",
    title: "Bay's Treats",
    blurb:
      "A pastry business storefront built for a real client operating across Lagos and Minna.",
    summary:
      "A full storefront for a working pastry business — menu, pricing, custom cake orders — that routes every order into WhatsApp, because that is how the business actually sells.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    accent: "#0F6B57",
    liveUrl: "https://baystreats-new-site.vercel.app/",
    repos: [{ url: "https://github.com/samimkabiru/baystreats-new-site" }],
    facts: {
      role: "Design & build, end to end",
      timeline: "Client project",
      status: "Live",
      client: "Bay's Treats, Lagos & Minna",
    },
    problem:
      "The client needed a storefront that could show a real menu and transparent pricing, take custom cake orders with real specifics (size, flavor, date), and still route everything into WhatsApp — the channel the business actually fulfills orders through — without needing a backend or payment processor.",
    approach: [
      "Built a full menu and transparent pricing section (banana bread toppings, small chops combo packs, pastries) from the business's real pricing",
      "Built a multi-field custom cake order form (type, size, flavor, design, date) that composes a pre-filled WhatsApp message on submit",
      "Added a founder story, testimonials, and trust signals — CAC registration and order stats",
      "Built out a photo gallery and social links tied into the brand's Instagram and TikTok",
      "Handled SEO metadata — title, description, Open Graph, and Twitter cards — for local discovery",
    ],
    result:
      "A full storefront — menu, pricing, custom order form, gallery, testimonials, and trust signals — that still funnels every real order straight into WhatsApp, matching exactly how the business operates day to day.",
    image: {
      src: "/projects/bays-treats.jpg",
      alt: "The Bay's Treats home page: 'Fresh From the Oven — Baked with Love' over a photograph of frosted cupcakes, with Order Now and View Our Menu buttons.",
      width: 1600,
      height: 736,
    },
    video: {
      src: "/projects/bays-treats-tour.mp4",
      poster: "/projects/bays-treats-tour.jpg",
      caption:
        "A pass through the live site — the hero, then the full menu with per-item descriptions and an Order on WhatsApp button on every card.",
    },
  },
  {
    slug: "taskflow",
    title: "TaskFlow",
    blurb:
      "A Trello-style task manager, built end to end — Spring Boot API, Next.js frontend, both deployed and live.",
    summary:
      "A full task management product: boards, lists and cards with real drag-and-drop, per-board roles, comments, file attachments, an activity log and notifications — backed by a Spring Boot API I wrote by hand and a Next.js frontend, both running in production.",
    tags: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
    ],
    accent: "#6B5AE0",
    liveUrl: "https://taskflow-tasksmanager.vercel.app/",
    repos: [
      { url: "https://github.com/samimkabiru/taskflow-api", label: "API" },
      {
        url: "https://github.com/samimkabiru/taskflow-frontend",
        label: "Frontend",
      },
    ],
    facts: {
      role: "Solo build — backend, frontend, deployment",
      timeline: "Personal project",
      status: "Live",
    },
    problem:
      "A friend's team had given up on Trello over its pricing and said they'd switch to something simpler if it covered the basics. That set the bar higher than a CRUD demo: boards people can actually be invited to, roles that genuinely restrict what you can do, an audit trail, file attachments, notifications — and a frontend good enough to use every day.",
    approach: [
      "Built the backend as nine vertical slices — auth, boards and membership, lists, tasks, labels, comments, attachments, activity log, notifications — shipping each one as DTOs, mapper, service and controller together rather than building the whole app layer by layer",
      "Full JWT lifecycle with refresh-token rotation and a deny-by-default security config. The filter authenticates from a UUID carried in the token, so a request never costs a database lookup just to work out who's calling",
      "Per-board roles (Owner, Admin, Member, Viewer) enforced through shared permission helpers, with an invite / accept / decline / revoke flow and self-service leave",
      "Fractional position maths for ordering lists and cards, so dragging a card writes a single row instead of renumbering the whole column, and per-board task codes (TSK-124) issued through an atomic counter",
      "Next.js frontend in TypeScript with Tailwind and shadcn/ui: drag-and-drop boards, dark mode, an activity feed, skeleton loaders and Framer Motion transitions",
      "Traced a mobile sign-out bug to the refresh cookie being SameSite=Strict, which blocks it cross-site everywhere. Fixed it with a same-origin Next.js rewrite proxy rather than the two easier options — a long-lived access token, or returning the refresh token in the response body — both of which would have traded away the security model for convenience",
      "Deployed the API to Render, the frontend to Vercel, and attachments to Backblaze B2's S3-compatible storage, across fifteen Flyway migrations",
    ],
    result:
      "A working product rather than a portfolio exercise: nine REST slices, Google OAuth alongside password login, scheduled due-date notifications, account deletion that anonymises in place, and both halves deployed and in use.",
    image: {
      src: "/projects/taskflow.jpg",
      alt: "TaskFlow's boards dashboard in dark mode, listing three boards with progress, member count and role.",
      width: 1600,
      height: 731,
    },
    video: {
      src: "/projects/taskflow-board.mp4",
      poster: "/projects/taskflow-board.jpg",
      caption:
        "Opening a board and moving cards between columns. Drag-and-drop uses fractional position maths, so a move writes one row rather than renumbering the column.",
    },
  },
  {
    slug: "niger-lpres",
    title: "Niger L-PRES",
    blurb:
      "The public site and the staff admin app for a $500M, World Bank-backed livestock programme in Niger State.",
    summary:
      "L-PRES in Niger State is a six-year, $500M livestock programme backed by the World Bank and the Federal Ministry of Agriculture and Food Security, running across 36 states. It needed two interfaces: a public site showing funded projects, value chains, milestones and a complaints route, and an admin app for the staff who publish and manage all of it. I built both frontends in React against an API a teammate wrote.",
    tags: ["React", "Tailwind CSS"],
    accent: "#008236",
    liveUrl: "https://www.nigerlpres.com.ng/",
    repos: [
      { url: "https://github.com/nigerlpres/nigerlpres", label: "Public site" },
    ],
    facts: {
      role: "Frontend, both apps — API by a teammate",
      timeline: "Organisation project",
      status: "Live",
      client: "Niger State L-PRES",
    },
    problem:
      "Public money on this scale has to be publicly answerable. Anyone — a farmer, a journalist, an auditor — should be able to see which projects have been funded, where they sit and whether they're finished, and should have somewhere to raise a complaint. So the site had to do two jobs at once: carry the institutional weight of a federal, state and World Bank-backed programme, and stay plain enough for the smallholders it serves. And none of it could be hand-written markup, because the project list grows every time something is delivered.",
    approach: [
      "Built both frontends in React and Tailwind against an API a teammate wrote — a clean split, with him owning the backend and me owning every interface, public and internal",
      "Project delivery renders straight from the API: a featured carousel on the homepage, the full listing, and a page per project on its own id, each carrying location and a completion status",
      "Built the admin app on the other side of that API — where programme staff publish and manage projects and news. That's what keeps the public site current without a developer touching it, which matters on a six-year programme that will outlast whoever built the site",
      "Laid out the five selected value chains — beef cattle, sheep and goat, poultry, micro-livestock and waste management — so a visitor can see where the money actually goes",
      "Built the sections that make a programme legible rather than abstract: the framework figures (six years, 36 states, $500M, five components), the delivery milestones, and quotes from the people running it — the State Project Coordinator, the Permanent Secretary, the Gender officer",
      "Carried the institutional branding a publicly funded programme has to display — the Federal Ministry of Agriculture and Food Security, the Niger State seal, the World Bank — without letting it crowd out the content",
      "Built the news section, an FAQ, and the public 'Lay a Complaint' route that gives anyone affected by the programme a way in",
      "Responsive throughout, because most of this audience arrives on a phone",
    ],
    result:
      "A live public site for a $500M programme at nigerlpres.com.ng, and the admin app behind it: every funded project visible with its status and location, the value chains and milestones explained, a complaints route open to anyone, and staff able to publish all of it themselves. Only the public site's repo is shareable — the admin app and the API belong to the organisation.",
    image: {
      src: "/projects/niger-lpres.jpg",
      alt: "The Niger L-PRES home page: 'Championing Livestock Transformation in Niger State' over a photograph of the state governor, with Our Projects and More About Us buttons.",
      width: 1600,
      height: 739,
    },
    video: {
      src: "/projects/niger-lpres-tour.mp4",
      poster: "/projects/niger-lpres-tour.jpg",
      caption:
        "A pass down the homepage — the funded-project carousel, the programme's remit and its partner bodies, the selected value chains — then through to the full project listing.",
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Wraps around, so the case study always has somewhere to go next. */
export function getAdjacent(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return { previous: undefined, next: undefined };

  const count = projects.length;
  return {
    previous: projects[(index - 1 + count) % count],
    next: projects[(index + 1) % count],
  };
}
