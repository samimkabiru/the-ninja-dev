"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { ProjectVideo as ProjectVideoData } from "@/data/projects";
import { useReducedMotion } from "@/hooks/use-media-query";

type ProjectVideoProps = {
  video: ProjectVideoData;
  className?: string;
};

/**
 * A short, silent, looping demo clip.
 *
 * Nothing downloads until the clip is near the viewport (`preload="none"`
 * plus a poster frame), it plays only while it's on screen, and it never
 * autoplays for anyone who has asked their OS for reduced motion. The pause
 * control isn't decoration — WCAG 2.2.2 requires a way to stop any motion
 * that starts on its own and runs longer than five seconds.
 *
 * `playing` is driven by the element's own play/pause events rather than set
 * by hand at each call site. That way a rejected autoplay, a pause from the
 * observer and a click on the button all converge on the same state without
 * three places having to agree.
 */
export function ProjectVideo({ video, className }: ProjectVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Reduced motion: leave it on the poster. The play button still works,
    // so the clip is available — it just isn't forced on anyone.
    if (reducedMotion) {
      element.pause();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          // Some browsers refuse autoplay outright. No play event fires, so
          // the poster and the play button stay put — nothing else to do.
          void element.play().catch(() => {});
        } else {
          element.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const toggle = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    if (element.paused) void element.play().catch(() => {});
    else element.pause();
  }, []);

  return (
    <figure className={className}>
      <div className="relative overflow-hidden rounded-xl bg-surface-sunken shadow-[var(--ring),var(--shadow-md)]">
        <video
          ref={ref}
          poster={video.poster}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="block w-full"
        >
          {/* WebM first: the browser takes the first source it supports, and
              it's typically 30–50% smaller than the equivalent MP4. */}
          {video.webm ? <source src={video.webm} type="video/webm" /> : null}
          <source src={video.src} type="video/mp4" />
        </video>

        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause the demo" : "Play the demo"}
          className="glass absolute right-3 bottom-3 rounded-full p-2.5 text-fg transition-transform hover:scale-105"
        >
          {playing ? (
            <Pause size={14} aria-hidden="true" />
          ) : (
            <Play size={14} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Not optional. The clip is silent and carries real information, so
          this is how it reaches anyone who can't or won't watch it. */}
      <figcaption className="mt-3 text-sm leading-relaxed text-muted">
        {video.caption}
      </figcaption>
    </figure>
  );
}
