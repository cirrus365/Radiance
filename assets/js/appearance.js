/*
 * radiance — appearance control.
 *
 * Wires the appearance selector (System, Radiance, Ambiance) and reveals
 * it once initialised. System removes any stored override so the page
 * follows prefers-color-scheme through CSS — including live operating
 * system changes. Explicit choices are stored in localStorage; when
 * storage is blocked the choice still applies to the current page.
 */

const STORAGE_KEY = "radiance-appearance";
const MODES = ["system", "light", "dark"];

function readStored() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return MODES.indexOf(value) !== -1 ? value : null;
  } catch {
    return null;
  }
}

function writeStored(mode) {
  try {
    if (mode === "system") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }
  } catch {
    // Storage blocked: the choice still applies to the current page.
  }
}

function apply(mode) {
  const root = document.documentElement;
  if (mode === "system") {
    root.removeAttribute("data-appearance");
  } else {
    root.setAttribute("data-appearance", mode);
  }
}

export function initAppearance() {
  const controls = document.querySelectorAll("[data-appearance-control]");
  const fieldsets = document.querySelectorAll("[data-appearance-fieldset]");
  if (controls.length === 0) {
    return;
  }

  const stored = readStored();
  const mode = stored || "system";
  apply(mode);

  const syncRadios = (value) => {
    fieldsets.forEach((fieldset) => {
      fieldset.querySelectorAll("input").forEach((radio) => {
        radio.checked = radio.value === value;
      });
    });
  };
  syncRadios(mode);

  controls.forEach((control) => {
    control.hidden = false;
  });

  fieldsets.forEach((fieldset) => {
    fieldset.addEventListener("change", (event) => {
      const value = event.target.value;
      if (MODES.indexOf(value) === -1) {
        return;
      }
      writeStored(value);
      apply(value);
      syncRadios(value);
    });
  });
}
