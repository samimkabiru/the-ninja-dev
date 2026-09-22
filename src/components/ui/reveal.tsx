"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-media-query";

type RevealProps = {
  children: ReactNode;
  /** Stagger, in seconds. */
  delay?: number;
  className?: string;
};

/**
 * Fades content in as it scrolls into view — and renders it immediately,
 * fully visible, for anyone who has asked their OS for reduced motion.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const visible = inView || reducedMotion;

  return (
    /*
     * No `will-change` here on purpose. Besides being a weak optimisation for
     * a one-shot fade, it makes this div a containing block for absolutely
     * positioned descendants — so `left: 0` inside a Reveal silently starts
     * meaning "the Reveal's edge" instead of the section's. The animating
     * `transform` below does the same thing while it runs, so never position
     * anything absolutely across this boundary.
     */
    <div
      ref={ref}
      data-reveal=""
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(18px)",
        transition: reducedMotion
          ? "none"
          : `opacity 600ms ease ${delay}s, transform 600ms ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
