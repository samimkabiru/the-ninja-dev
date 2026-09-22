import type { IconType } from "react-icons";
import { FaJava, FaWindows } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import {
  SiGit,
  SiGithub,
  SiHtml5,
  SiIntellijidea,
  SiJavascript,
  SiMysql,
  SiNextdotjs,
  SiPostgresql,
  SiPostman,
  SiRadixui,
  SiReact,
  SiShadcnui,
  SiSpringboot,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";

type TechEntry = {
  Icon?: IconType;
  /**
   * Official brand colour. Omitted for marks that are pure black or white —
   * those inherit `currentColor` so they stay legible in both themes.
   */
  color?: string;
  /** Rendered as a lettered tile when no brand mark exists. */
  fallback?: { label: string; bg: string; fg: string };
};

/**
 * Real brand marks, not hand-drawn approximations. `react-icons` ships the
 * official Simple Icons / Font Awesome paths, so nothing here depends on a
 * CDN being reachable at runtime.
 */
const registry = {
  JavaScript: { Icon: SiJavascript, color: "#F7DF1E" },
  TypeScript: { Icon: SiTypescript, color: "#3178C6" },
  React: { Icon: SiReact, color: "#61DAFB" },
  "Next.js": { Icon: SiNextdotjs },
  "Tailwind CSS": { Icon: SiTailwindcss, color: "#06B6D4" },
  "shadcn/ui": { Icon: SiShadcnui },
  "Radix UI": { Icon: SiRadixui },
  Java: { Icon: FaJava, color: "#E76F00" },
  "Spring Boot": { Icon: SiSpringboot, color: "#6DB33F" },
  MySQL: { Icon: SiMysql, color: "#00758F" },
  PostgreSQL: { Icon: SiPostgresql, color: "#336791" },
  Git: { Icon: SiGit, color: "#F05033" },
  GitHub: { Icon: SiGithub },
  "HTML/CSS": { Icon: SiHtml5, color: "#E34F26" },
  "VS Code": { Icon: VscVscode, color: "#0078D4" },
  "IntelliJ IDEA": { Icon: SiIntellijidea },
  Postman: { Icon: SiPostman, color: "#FF6C37" },
  Vercel: { Icon: SiVercel },
  Windows: { Icon: FaWindows, color: "#0078D6" },
  Stitch: { fallback: { label: "St", bg: "#4285F4", fg: "#FFFFFF" } },
  Antigravity: { fallback: { label: "Ag", bg: "#6C4CDB", fg: "#FFFFFF" } },
} satisfies Record<string, TechEntry>;

export type TechName = keyof typeof registry;

export function getTech(name: TechName): TechEntry {
  return registry[name];
}

export const techNames = Object.keys(registry) as TechName[];
