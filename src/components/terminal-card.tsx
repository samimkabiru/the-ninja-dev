"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site";
import { useReducedMotion } from "@/hooks/use-media-query";

/** How fast it types, and how long it waits before starting. */
const MS_PER_CHAR = 24;
const START_DELAY = 320;

type Segment = { text: string; className?: string };

const PUNCT = "text-stone-500";

function property(key: string, value: string, kind: "string" | "boolean") {
  return [
    { text: "  " },
    { text: key, className: "text-emerald-300" },
    { text: ": ", className: PUNCT },
    {
      text: value,
      className: kind === "string" ? "text-amber-200" : "text-purple-400",
    },
    { text: ",", className: "text-stone-600" },
  ] satisfies Segment[];
}

const LINES: Segment[][] = [
  [
    { text: "const ", className: "text-purple-400" },
    { text: "dev", className: "text-sky-300" },
    { text: " = {", className: PUNCT },
  ],
  property("name", `'${siteConfig.name}'`, "string"),
  property("alias", `'${siteConfig.handle}'`, "string"),
  property("role", `'${siteConfig.role}'`, "string"),
  property("based", `'${siteConfig.location}'`, "string"),
  property("stack", "['React', 'Next.js', 'Spring Boot']", "string"),
  property("open", "true", "boolean"),
  [{ text: "}", className: PUNCT }],
];

type Placed = Segment & { start: number; end: number; isLast: boolean };

/**
 * Character offsets are worked out once here rather than by running a counter
 * during render — the render callbacks aren't guaranteed to run in order, and
 * this doesn't change between renders anyway.
 */
const PLACED: Placed[][] = (() => {
  let cursor = 0;
  return LINES.map((line, lineIndex) =>
    line.map((segment, segmentIndex) => {
      const start = cursor;
      cursor += segment.text.length;
      return {
        ...segment,
        start,
        end: cursor,
        isLast:
          lineIndex === LINES.length - 1 && segmentIndex === line.length - 1,
      };
    }),
  );
})();

const TOTAL = PLACED.at(-1)?.at(-1)?.end ?? 0;

/**
 * Types itself out on load, then leaves a blinking cursor at the end.
 *
 * Every character is in the DOM from the first paint — the untyped ones are
 * `visibility: hidden`, so they still take up space. That's what keeps the
 * card at its final size throughout: appending characters as they're typed
 * would grow the box and shove the rest of the hero down the page while
 * someone is reading it.
 *
 * The whole card is decorative and `aria-hidden`; every fact in it appears as
 * real prose in the hero copy and the About section, so nothing is lost to
 * anyone who can't see it animate.
 */
export function TerminalCard() {
  const reducedMotion = useReducedMotion();
  const [typed, setTyped] = useState(0);

  // Derived, not stored: reduced motion shows the finished block immediately
  // without needing an effect to set state.
  const visible = reducedMotion ? TOTAL : typed;
  const done = visible >= TOTAL;

  useEffect(() => {
    if (reducedMotion) return;

    let frame = 0;
    let startedAt = 0;

    // Driven by elapsed time rather than a per-character interval, so it runs
    // at the same speed on a slow device and survives a backgrounded tab.
    const tick = (now: number) => {
      if (!startedAt) startedAt = now;

      const elapsed = now - startedAt - START_DELAY;
      const chars = Math.max(
        0,
        Math.min(TOTAL, Math.floor(elapsed / MS_PER_CHAR)),
      );

      // Returning the same value lets React bail out instead of re-rendering
      // on every frame.
      setTyped((previous) => (previous === chars ? previous : chars));

      if (chars < TOTAL) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl bg-[#14130f] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07),var(--shadow-xl)]"
    >
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-xs text-stone-500">
          profile.ts
        </span>
      </div>

      <pre className="overflow-x-auto p-6 font-mono text-sm leading-7">
        <code>
          {PLACED.map((line, lineIndex) => (
            <span key={lineIndex} className="block">
              {line.map((segment, segmentIndex) => {
                const shown = Math.max(
                  0,
                  Math.min(segment.text.length, visible - segment.start),
                );

                const hasCaret =
                  (visible >= segment.start && visible < segment.end) ||
                  (done && segment.isLast);

                return (
                  <span key={segmentIndex} className={segment.className}>
                    {segment.text.slice(0, shown)}
                    {hasCaret ? <Caret blink={done} /> : null}
                    <span className="terminal-pending">
                      {segment.text.slice(shown)}
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

/**
 * Zero-width in the layout — the bar is drawn by an absolutely positioned
 * child, so moving the caret along never nudges the characters around it.
 */
function Caret({ blink }: { blink: boolean }) {
  return (
    <span className="relative inline-block w-0 align-baseline">
      <span
        className={`absolute bottom-[-0.18em] left-0 h-[1.05em] w-[0.55em] rounded-[1px] bg-white/90 ${
          blink ? "animate-caret" : ""
        }`}
      />
    </span>
  );
}
