"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { getAdjacent, type Project } from "@/data/projects";
import { CaseStudy, CaseStudyActions } from "./case-study";

/** Matches the exit transition in globals.css. */
const EXIT_MS = 320;

/**
 * The case study as an overlay, shown when you open a project from the grid.
 *
 * It is the same `<CaseStudy>` the standalone route renders — this only adds
 * chrome. A native <dialog> handles focus trapping, Escape and the inert
 * background; closing pops the history entry, so the browser back button and
 * the close button do the same thing.
 */
export function ProjectOverlay({ project }: { project: Project }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  // The header title fades in only once the real <h1> has scrolled away, so
  // the name isn't printed twice at the top of the panel.
  const [showHeaderTitle, setShowHeaderTitle] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  // <dialog> doesn't stop the page behind it scrolling.
  useEffect(() => {
    const { style } = document.body;
    const previousOverflow = style.overflow;
    const previousPadding = style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    style.overflow = "hidden";
    if (scrollbar > 0) style.paddingRight = `${scrollbar}px`;

    return () => {
      style.overflow = previousOverflow;
      style.paddingRight = previousPadding;
    };
  }, []);

  /** Fires for the close button, Escape and a backdrop click alike. */
  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    // Let the exit transition finish before the route unmounts the dialog.
    setTimeout(() => router.back(), EXIT_MS);
  }, [router]);

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    else handleClose();
  }, [handleClose]);

  /*
   * Moving between projects keeps this component mounted, so anything that
   * remembers "we're closing" has to be cleared — otherwise the first close
   * after a prev/next was swallowed and the X button appeared dead.
   */
  useEffect(() => {
    closingRef.current = false;
    scrollerRef.current?.scrollTo({ top: 0 });
  }, [project.slug]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => setShowHeaderTitle(scroller.scrollTop > 120);
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [project.slug]);

  // Arrow keys move between projects without leaving the overlay.
  useEffect(() => {
    const { previous, next } = getAdjacent(project.slug);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select")) return;

      if (event.key === "ArrowLeft" && previous) {
        router.replace(`/projects/${previous.slug}`, { scroll: false });
      } else if (event.key === "ArrowRight" && next) {
        router.replace(`/projects/${next.slug}`, { scroll: false });
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [project.slug, router]);

  return (
    <dialog
      ref={dialogRef}
      className="overlay"
      onClose={handleClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose();
      }}
      aria-labelledby="overlay-title"
    >
      <div className="flex h-full w-full items-end justify-center sm:items-center sm:p-6">
        <div className="overlay-panel glass-strong flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl shadow-soft-xl sm:max-h-[88svh] sm:rounded-2xl">
          {/* Sticky header — the title stays in view while you read. */}
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line/70 px-6 py-4">
            <div className="min-w-0">
              <p className="font-mono text-[11px] text-faint">case study</p>
              <p
                id="overlay-title"
                className="truncate font-display font-semibold transition-opacity duration-200"
                style={{ opacity: showHeaderTitle ? 1 : 0 }}
              >
                {project.title}
              </p>
            </div>

            <button
              type="button"
              autoFocus
              onClick={requestClose}
              aria-label="Close case study"
              className="shrink-0 rounded-full p-2 shadow-[var(--ring)] transition-colors hover:bg-surface-alt"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </header>

          <div
            ref={scrollerRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-8"
          >
            <CaseStudy project={project} variant="overlay" />
          </div>

          {/* Sticky footer — the thing you opened this to click is always
              reachable, instead of buried under three sections of text. */}
          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-line/70 px-6 py-4">
            <p className="hidden font-mono text-[11px] text-faint sm:block">
              ← → to browse · esc to close
            </p>
            <CaseStudyActions project={project} compact />
          </footer>
        </div>
      </div>
    </dialog>
  );
}
