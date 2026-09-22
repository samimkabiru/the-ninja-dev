# theNinjaDev — portfolio

Personal portfolio for Samim Kabiru. Next.js 16 (App Router), TypeScript, Tailwind CSS v4.

## Running it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Script              | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                     |
| `npm run build`     | Production build                               |
| `npm start`         | Serve the production build                     |
| `npm run lint`      | ESLint (Next.js + TypeScript rules)            |
| `npm run typecheck` | `tsc --noEmit`                                 |

## Before you deploy

Email and GitHub are set. Two things are still placeholders, both in
`src/data/site.ts`.

1. **Résumé** — drop your CV at `public/resume.pdf`, then set
   `resumePath: "/resume.pdf"`. It's `null` by default so the site never ships
   a button that 404s.
2. **Site URL** — `siteConfig.url` still points at `theninjadev.dev`. Set
   `NEXT_PUBLIC_SITE_URL` to wherever this actually deploys. It feeds the
   canonical URL, the Open Graph tags, `sitemap.xml` and `robots.txt`, so a
   wrong value here quietly tells search engines the wrong address for every
   page.

`x` and `linkedin` in `siteConfig.links` are empty. Fill either one and it
appears in the contact block and in the `sameAs` list search engines use to
link your profiles together.

Also worth a second look: the About section says "nearly two years" and the hero card says the same. Keep that honest and current — it's the first thing a client reads.

## Where things live

```
src/
  app/
    layout.tsx              metadata, fonts, theme bootstrap, modal slot
    page.tsx                section order
    globals.css             design tokens, glass, blooms, overlay animation
    projects/[slug]/        a standalone case study page per project
    @modal/(.)projects/     the same case study, intercepted as an overlay
    opengraph-image.tsx     link-preview card, generated at build time
    icon.svg  sitemap.ts  robots.ts
    api/contact/route.ts    contact form handler
    fonts/                  self-hosted variable fonts
  components/
    sections/               one file per section of the page
    ui/                     Section, Reveal, Tag, TechIcon, ProjectThumb
    case-study.tsx          the case study body, shared by page and overlay
    project-overlay.tsx     the overlay chrome around it
    nav.tsx  footer.tsx  contact-form.tsx  terminal-card.tsx
  data/                     all the content — edit here, not in the components
  hooks/  lib/
```

**Adding a project** is one object in `src/data/projects.ts` — it gets a card,
a `/projects/<slug>` page, an entry in the sitemap and its own metadata with
no other changes. **Adding a skill** is one line in `src/data/skills.ts`; if
the tech isn't in `src/lib/tech.tsx` yet, add it there first so it gets a
brand icon.

## Case studies

Each project is a real route at `/projects/<slug>`, prerendered at build time
with its own title, description and Open Graph tags — so a case study can be
shared, bookmarked and indexed on its own.

Opening one from the work grid doesn't leave the page: Next.js intercepts the
route and renders the same case study as an overlay, with the grid still
behind it. The back button and Escape both close it. A direct visit or a
refresh gets the standalone page instead. Both render the exact same
`<CaseStudy>` component, so they can't drift apart.

## Adding screenshots

This is the single biggest upgrade available to the site. Put an image in
`public/projects/` and add one line to the project in `src/data/projects.ts`:

```ts
image: { src: "/projects/bays-treats.png", alt: "The Bay's Treats storefront" },
```

The card and the case study both pick it up — `next/image` handles sizing and
lazy loading. Until then they show a designed browser-frame placeholder, and
the case study skips the large frame entirely rather than showing an empty
one. A portrait works the same way: drop it at `public/me.jpg` and set
`portrait` in `src/data/site.ts`.

## Adding a demo clip

A case study can carry one short video, shown under "in motion" after the
approach:

```ts
video: {
  src: "/projects/bays-treats-order.mp4",
  webm: "/projects/bays-treats-order.webm",   // optional, smaller
  poster: "/projects/bays-treats-order.jpg",
  caption: "Filling the custom cake form and handing off to WhatsApp with the order details already written.",
},
```

Record only what a screenshot can't show — an interaction, a handoff, a thing
working with the network off. Keep it 8–15 seconds, silent, no intro, and
export MP4 rather than GIF (a GIF is roughly ten times the size for worse
quality). Aim for under 3 MB, because this loads over mobile data.

The player downloads nothing until the clip is near the viewport, plays only
while it's on screen, and stays on the poster frame for anyone with reduced
motion turned on. The pause button is required rather than decorative — WCAG
2.2.2 covers any motion that starts on its own and runs past five seconds.
The caption is required too: it's how the clip reaches someone who can't
watch it.

To shrink a recording before committing it:

```bash
ffmpeg -i raw.mp4 -vf "scale=1280:-2" -c:v libx264 -crf 28 -an -movflags +faststart out.mp4
ffmpeg -i raw.mp4 -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 36 -b:v 0 -an out.webm
ffmpeg -i raw.mp4 -vframes 1 -vf "scale=1280:-2" poster.jpg
```

## Theming

Colours are CSS custom properties in `globals.css`, exposed to Tailwind through `@theme inline`. Changing the accent is one line:

```css
:root  { --accent: #0f6b57; }
.dark  { --accent: #34d399; }
```

Dark mode is a `dark` class on `<html>`, set before first paint by a small inline script, so there's no flash of the wrong theme. Because the palette lives in CSS, almost every section stays a React Server Component — only the nav, the FAQ, the drawer, the form, the cursor and the scroll-reveal ship JavaScript.

Every foreground/background pair clears WCAG AA (4.5:1).

## Contact form

Works with no configuration: it validates in the browser and, if no mail provider is set up, hands the visitor a pre-filled `mailto:` link instead of failing silently.

Delivery goes through [Formspree](https://formspree.io), which sends the email on your behalf — so there's no domain to own, no API key, and nothing to set in the environment. The endpoint is `contactFormEndpoint` in `src/data/site.ts`; **which address enquiries land at is configured in the Formspree dashboard, not in this repo.** Set it to `null` and the form reverts to the `mailto:` fallback.

That's the one thing most services get wrong for a project like this. Resend, Postmark and the rest will only send *from* a domain you've verified with them, which makes them a non-starter until you own one. Formspree is the sender, so it works from nothing. The trade is volume: the free plan is 50 submissions a month, against Resend's 100 a day.

The request goes out from the route handler (`src/app/api/contact/route.ts`) rather than the browser, which keeps server-side validation, a honeypot field and a 3-per-minute-per-IP rate limit in front of Formspree — bot submissions never reach them, so they never count against the quota. The limiter is in-memory and resets on a cold start; fine for a portfolio, but put something like Upstash in front of it if you ever get hammered.

Two field names are Formspree's conventions rather than arbitrary keys: `email` sets the Reply-To on the notification, so replying goes to the visitor, and `subject` sets the subject line (not `_subject`, which is the older convention). Renaming either quietly loses the behaviour.

If you later buy a domain and want to send from it, that's the point to reach for Resend — verify the domain, then swap the `fetch` in the route.

## Deploying

Push to GitHub and import the repo at [vercel.com](https://vercel.com) — it detects Next.js with no configuration. Any Node host works too: `npm run build && npm start`.

There is nothing you have to configure for the site to work. The only variable worth setting is `NEXT_PUBLIC_SITE_URL` (see `.env.example`), and only so that canonical URLs, Open Graph tags and the sitemap point at the real address rather than the fallback. Give it a value or leave it out entirely — an empty variable just gets you the fallback silently.

## Notes on the fonts

Inter, Space Grotesk and JetBrains Mono are vendored as variable `.woff2` files in `src/app/fonts` and loaded with `next/font/local`. That means no request to Google on every page load, no GDPR question, the build works offline, and the system fallback is metric-matched so text doesn't jump while the font loads. Three files, about 110 KB total.
