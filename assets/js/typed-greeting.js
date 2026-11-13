/*
 * radiance — typed greeting.
 *
 * Types the homepage greeting into the visible span, character by
 * character: one short line, no loop, total animation capped at about
 * three seconds regardless of length. The complete sentence is present
 * server-side (the span starts full; the script clears and retypes it),
 * the animated span is aria-hidden and the assistive-technology copy is
 * visually hidden, so no partial string is ever announced.
 *
 * With prefers-reduced-motion the finished text stays as rendered: no
 * typing, no cursor. The cursor blinks only while typing and is removed
 * when the line is complete.
 */

const TOTAL_MS = 3000;
const MAX_DELAY_MS = 70;

export function initTypedGreeting() {
  const spans = document.querySelectorAll("[data-typed]");
  if (spans.length === 0) {
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  spans.forEach((span) => {
    if (reduce) {
      return;
    }
    const full = span.textContent;
    if (!full) {
      return;
    }
    const delay = Math.min(MAX_DELAY_MS, TOTAL_MS / full.length);
    let shown = 0;
    span.classList.add("is-typing");
    span.textContent = "";
    const tick = () => {
      shown += 1;
      span.textContent = full.slice(0, shown);
      if (shown < full.length) {
        window.setTimeout(tick, delay);
      } else {
        span.classList.remove("is-typing");
      }
    };
    window.setTimeout(tick, delay);
  });
}
