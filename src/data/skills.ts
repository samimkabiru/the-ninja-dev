import type { TechName } from "@/lib/tech";

export type SkillGroup = {
  group: string;
  items: TechName[];
  /** Spans two columns on large screens. */
  wide?: boolean;
};

export const skillGroups: SkillGroup[] = [
  {
    group: "frontend",
    items: ["JavaScript", "TypeScript", "React", "Next.js"],
    wide: true,
  },
  { group: "ui & styling", items: ["Tailwind CSS", "shadcn/ui", "Radix UI"] },
  { group: "backend", items: ["Java", "Spring Boot"] },
  { group: "database", items: ["MySQL", "PostgreSQL"] },
  { group: "version control", items: ["Git", "GitHub"] },
];

export type UsesItem = { name: TechName; role: string };

export const uses: UsesItem[] = [
  { name: "VS Code", role: "Frontend & general editing" },
  { name: "IntelliJ IDEA", role: "Spring Boot & backend work" },
  { name: "Antigravity", role: "AI-assisted frontend development" },
  { name: "Postman", role: "API testing" },
  { name: "Vercel", role: "Deploying Next.js apps" },
  { name: "Stitch", role: "UI design & prototyping" },
  { name: "Windows", role: "Daily driver OS" },
];
