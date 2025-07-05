/**
 * Given a reset timestamp (milliseconds since epoch),
 * returns a human‑friendly string like:
 *   • "Resets in 2h 5m 12s"
 *   • "Resets in 45s"
 *   • "Resets at 17:23:45"
 *
 * @param resetMs  The reset time in ms since 1970‑01‑01 UTC
 * @param opts     Optional settings:
 *   • mode:    "relative" (default) | "absolute"
 *   • locale:  any BCP‑47 locale string (default: browser locale)
 */
export function formattedResetTimestamp(
  resetMs: number,
  opts?: { mode?: "relative" | "absolute"; locale?: string }
): string {
  const { mode = "relative", locale = navigator.language } = opts || {};
  const now = Date.now();

  if (mode === "absolute") {
    // show a clock‐time
    return `Resets at ${new Date(resetMs).toLocaleTimeString(locale)}`;
  }

  // relative mode
  const diff = resetMs - now;
  if (diff <= 0) {
    return "Resets now";
  }

  let seconds = Math.ceil(diff / 1000);
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds) parts.push(`${seconds}s`);

  return `${parts.join(" ")}`;
}
