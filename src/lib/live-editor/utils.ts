/**
 * Minimal class-name joiner — no clsx, no tailwind-merge.
 * The live editor has no conflicting utilities so a simple join suffices.
 */
export function cn(...inputs: (string | boolean | null | undefined)[]): string {
  return inputs.filter(Boolean).join(" ");
}
