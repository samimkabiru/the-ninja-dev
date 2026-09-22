const STORAGE_KEY = "theme";

/**
 * Runs before first paint (injected in layout.tsx) so the right theme class is
 * on <html> before anything renders — no flash of the wrong theme.
 *
 * The <html> class is the single source of truth for the theme. Nothing in
 * React holds a copy of it, which is why every section below can stay a server
 * component: the whole palette switches via CSS custom properties.
 */
export const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
  // Scroll-reveal is undone by JS, so mark that JS is alive. Without this the
  // no-js stylesheet rule keeps every revealed block visible.
  document.documentElement.classList.remove('no-js');
})();
`;

function apply(theme: "light" | "dark") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function toggleTheme() {
  const next = document.documentElement.classList.contains("dark")
    ? "light"
    : "dark";

  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Private browsing or blocked storage: the toggle still works for this
    // visit, it just won't be remembered.
  }

  apply(next);
}

/**
 * Follow the OS setting until the visitor has made an explicit choice.
 * Returns an unsubscribe function.
 */
export function watchSystemTheme(): () => void {
  const query = window.matchMedia("(prefers-color-scheme: dark)");

  const onChange = (event: MediaQueryListEvent) => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Fall through and follow the OS.
    }
    apply(event.matches ? "dark" : "light");
  };

  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
