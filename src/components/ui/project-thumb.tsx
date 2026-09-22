import Image from "next/image";
import type { Project } from "@/data/projects";
import { TechIcon } from "./tech-icon";

type ProjectThumbProps = {
  project: Project;
  /** Controls the frame's chrome and typography. */
  size?: "card" | "hero";
  className?: string;
  priority?: boolean;
};

/**
 * A browser frame around the project's screenshot.
 *
 * When the image carries its pixel dimensions it's rendered at its own aspect
 * ratio, uncropped — a screen capture is usually much wider than any fixed
 * box, and cropping one to fit slices the edges off whatever isn't centred.
 * Only the empty-slot placeholder uses a fixed ratio, because there's nothing
 * in it to lose.
 *
 * Until `project.image` is filled in, the frame holds a designed placeholder
 * and the address bar still shows the real deployed URL, so the slot reads as
 * intentional rather than missing.
 */
export function ProjectThumb({
  project,
  size = "card",
  className,
  priority = false,
}: ProjectThumbProps) {
  const isHero = size === "hero";
  const { image } = project;
  const hasDimensions = Boolean(image?.width && image?.height);

  // Show a real address or none at all — an invented "project.local" reads as
  // a placeholder someone forgot to fill in.
  const fallbackRepo = project.repos?.[0]?.url;
  const address = project.liveUrl
    ? new URL(project.liveUrl).host
    : fallbackRepo
      ? new URL(fallbackRepo).host + new URL(fallbackRepo).pathname
      : null;

  return (
    <div
      className={`overflow-hidden rounded-xl bg-surface shadow-[var(--ring),var(--shadow-md)] ${className ?? ""}`}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 border-b border-line px-3"
        style={{ height: isHero ? 36 : 30 }}
      >
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
        </span>

        {address ? (
          <span
            className="mx-auto max-w-[70%] truncate rounded-md bg-surface-sunken px-2 py-0.5 font-mono text-faint"
            style={{ fontSize: isHero ? 11 : 9.5 }}
          >
            {address}
          </span>
        ) : null}
      </div>

      {/* Viewport */}
      {image && hasDimensions ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width!}
          height={image.height!}
          priority={priority}
          sizes={
            isHero
              ? "(max-width: 768px) 100vw, 768px"
              : "(max-width: 640px) 100vw, 600px"
          }
          className="block h-auto w-full"
        />
      ) : (
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: isHero ? "16 / 10" : "16 / 9",
            background: `linear-gradient(140deg, ${project.accent}1f, ${project.accent}05 55%, transparent)`,
          }}
        >
          {image ? (
            // An image with no dimensions given: fall back to the fixed box.
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={priority}
              sizes={
                isHero
                  ? "(max-width: 768px) 100vw, 768px"
                  : "(max-width: 640px) 100vw, 600px"
              }
              className="object-cover object-top"
            />
          ) : (
            <>
              {/* Faint wireframe, so an empty slot still has structure. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.5]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, var(--dot-grid) 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                  maskImage:
                    "linear-gradient(to bottom right, black, transparent 70%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom right, black, transparent 70%)",
                }}
              />

              {project.tags[0] ? (
                <TechIcon
                  name={project.tags[0]}
                  size={isHero ? 180 : 112}
                  className="absolute -right-7 -bottom-7 opacity-[0.09]"
                />
              ) : null}

              <span
                aria-hidden="true"
                className="absolute top-4 left-4 font-mono text-xs"
                style={{ color: project.accent }}
              >
                {"{ }"}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
