export type Faq = { question: string; answer: string };

/**
 * Written for someone deciding whether to interview you, not for a client
 * scoping a project. That changes what belongs here: a hiring manager wants
 * to know what you want, what you can actually do, how you work with other
 * people, and where the gaps are. They do not want a quote.
 *
 * Keep the honest ones. An FAQ where every answer is a strength reads as
 * marketing and gets skimmed; one that names a real limit gets believed.
 */
export const faqs: Faq[] = [
  {
    question: "What kind of role are you looking for?",
    answer:
      "A full-time remote role as a full-stack or backend-leaning engineer, with a bias toward fintech — the problems I find most interesting are the ones where the arithmetic has to be right. I'm based in Abuja and work on West Africa Time, which overlaps a full working day with Europe and the morning with the US East Coast.",
  },
  {
    question: "What have you actually shipped?",
    answer:
      "Everything in the work section above is deployed and reachable — a savings app with a double-entry ledger, a task manager with a Spring Boot API behind it, a public site for a World Bank-backed state programme, and a storefront for a working pastry business. Two of them have real users who aren't me.",
  },
  {
    question: "What's your stack?",
    answer:
      "React and Next.js with TypeScript on the frontend, Java and Spring Boot with Postgres on the backend. The full breakdown is in the Skills section — but I care more about picking the boring option that fits than about the stack itself.",
  },
  {
    question: "What are you strongest at, and what are you still learning?",
    answer:
      "Strongest on the frontend — that's where I started and where I've shipped the most. The backend is the newer half, and the deliberate focus: double-entry ledgers, idempotency and row locking were all first-time problems on the Ajo build rather than things I already knew. I'd rather say that than have you find out in a code review.",
  },
  {
    question: "Have you worked on a team?",
    answer:
      "Yes. On Niger L-PRES I built both frontends against an API a teammate owned, which meant agreeing a contract up front and living with it. The rest has been solo work, so the honest answer is that I have more experience shipping than I do reviewing other people's code.",
  },
  {
    question: "How do I get in touch?",
    answer:
      "The contact form just below, or email me directly — either reaches me. If you're hiring, a line about the team and the stack is enough to start; I'll come back with questions.",
  },
];
