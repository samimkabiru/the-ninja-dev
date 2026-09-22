/** Tiny conditional-className joiner. Keeps the JSX readable without pulling
 *  in clsx + tailwind-merge for a site this size. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
