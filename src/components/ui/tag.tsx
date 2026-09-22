import type { TechName } from "@/lib/tech";
import { TechIcon } from "./tech-icon";

export function Tag({ name }: { name: TechName }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-alt px-2.5 py-1 font-mono text-[11px] text-muted shadow-[var(--ring)]">
      <TechIcon name={name} size={13} />
      {name}
    </span>
  );
}
