import { getTech, type TechName } from "@/lib/tech";

type TechIconProps = {
  name: TechName;
  size?: number;
  className?: string;
};

/**
 * Renders the real brand mark for a technology. Marks that are pure black or
 * white inherit `currentColor` so they stay visible in both themes.
 */
export function TechIcon({ name, size = 16, className }: TechIconProps) {
  const tech = getTech(name);

  if (tech.Icon) {
    const { Icon } = tech;
    // react-icons sizes via its own `size` prop — passing width/height leaves
    // every mark stuck at the default 1em.
    return (
      <Icon
        size={size}
        aria-hidden="true"
        focusable="false"
        className={className}
        style={{ color: tech.color, flexShrink: 0 }}
      />
    );
  }

  if (tech.fallback) {
    const { label, bg, fg } = tech.fallback;
    return (
      <span
        aria-hidden="true"
        className={`inline-flex shrink-0 items-center justify-center rounded font-mono font-semibold leading-none ${className ?? ""}`}
        style={{
          width: size,
          height: size,
          backgroundColor: bg,
          color: fg,
          fontSize: size * 0.42,
        }}
      >
        {label}
      </span>
    );
  }

  return null;
}
