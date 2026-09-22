"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { toggleTheme, watchSystemTheme } from "@/lib/theme";

export function ThemeToggle() {
  useEffect(() => watchSystemTheme(), []);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="rounded-full p-2 text-muted shadow-[var(--ring)] transition-colors hover:bg-surface hover:text-fg"
    >
      {/* Both icons ship in the HTML and CSS picks one. Deciding in JS would
          mean the server and client disagree on the first render. */}
      <Moon size={15} aria-hidden="true" className="dark:hidden" />
      <Sun size={15} aria-hidden="true" className="hidden dark:block" />
    </button>
  );
}
