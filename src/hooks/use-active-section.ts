"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-spy for the nav.
 *
 * The original watched for `isIntersecting` and took whichever section fired
 * last, which meant scrolling up could highlight the wrong link. This tracks
 * every visible section and always picks the topmost one, so the highlight is
 * correct in both directions.
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }

        const topmost = ids.find((id) => visible.has(id));
        if (topmost) setActive(topmost);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    return () => observer.disconnect();
  }, [ids]);

  return active;
}
