/*
 * radiance — appearance toggle.
 *
 * A single compact button at the far right of the top panel. Activating
 * it swaps between the light and dark appearances; the choice is stored
 * in localStorage under one namespaced key and applied before first paint
 * by the early appearance script. With no stored choice the page follows
 * prefers-color-scheme through CSS — including live operating system
 * changes — and the button state tracks the resolved appearance.
 */

const STORAGE_KEY = "radiance-appearance";

function readStored() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function writeStored(mode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Storage blocked: the choice still applies to the current page.
  }
}

export function initAppearance() {
  const button = document.querySelector("[data-appearance-toggle]");
  if (!button) {
    return;
  }

  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const resolved = () => {
    const stored = readStored();
    if (stored) {
      return stored;
    }
    return media.matches ? "dark" : "light";
  };

  const sync = () => {
    button.setAttribute("aria-pressed", String(resolved() === "dark"));
  };

  button.hidden = false;
  sync();

  button.addEventListener("click", () => {
    const next = resolved() === "dark" ? "light" : "dark";
    writeStored(next);
    root.setAttribute("data-appearance", next);
    sync();
  });

  // With no stored choice, keep the button state in step with live
  // operating-system changes.
  media.addEventListener("change", () => {
    if (!readStored()) {
      root.removeAttribute("data-appearance");
      sync();
    }
  });
}
