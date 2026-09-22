import { Code2, PenTool, Rocket, Search, type LucideIcon } from "lucide-react";

export type ProcessStep = {
  step: string;
  title: string;
  icon: LucideIcon;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Discover",
    icon: Search,
    description:
      "A quick conversation to understand what you're actually building and why — the real requirements, not just a feature list.",
  },
  {
    step: "02",
    title: "Design",
    icon: PenTool,
    description:
      "Turning that into an interface that's simple, professional, and easy to actually use.",
  },
  {
    step: "03",
    title: "Build",
    icon: Code2,
    description:
      "Frontend, backend, database — built and connected end to end, not handed off in disconnected pieces.",
  },
  {
    step: "04",
    title: "Launch & Support",
    icon: Rocket,
    description:
      "Shipped, tested, and available for the fixes and follow-ups that come after launch.",
  },
];
