export type ExperienceItem = {
  period: string;
  title: string;
  description: string;
};

export const experience: ExperienceItem[] = [
  {
    period: "getting started",
    title: "Started building software professionally",
    description:
      "Began working as a full-stack developer, building out the stack that still anchors everything I ship today — React on the frontend, Java and Spring Boot on the backend.",
  },
  {
    period: "first client work",
    title: "Took on real freelance projects",
    description:
      "Moved from personal projects to building for actual businesses — including a full storefront build for a Nigerian pastry business, end to end.",
  },
  {
    period: "going deeper",
    title: "Built backend systems from scratch",
    description:
      "Designed and shipped a Spring Boot REST API with full JWT authentication, role-based access, and activity logging — owning the backend, not just consuming one.",
  },
  {
    period: "today",
    title: "Full-stack, end to end",
    description:
      "Comfortable owning a project from interface design through backend architecture, database design, and deployment.",
  },
];
