/*
 * radiance — appearance toggle.
 *
 * A single compact control at the far right of the top panel, driven by
 * the schemes in data/schemes (names arrive on the button's data
 * attributes, rendered by partials/panel-top.html). With two schemes the
 * control swaps between them and carries aria-pressed (true while the
 * dark scheme is active). With three or more it opens a small scheme
 * menu: Escape or a click outside closes it, Arrow Up and Arrow Down move
 * focus among the options and each option applies its scheme.
 *
 * The choice is stored in localStorage under one namespaced key and is
 * applied before first paint by the generated inline script (see
 * partials/scheme-init.html). With no stored choice the page follows
 * prefers-color-scheme through CSS — including live operating system
 * changes — and the control's state tracks the resolved scheme.
 */

const STORAGE_KEY = "radiance-appearance";

function readStored(valid) {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return valid.indexOf(value) !== -1 ? value : null;
  } catch {
    return null;
  }
}

function writeStored(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
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
  const names = (button.getAttribute("data-appearance-schemes") || "").split(",").filter(Boolean);
  if (names.length === 0) {
    return;
  }
  const darkName = button.getAttribute("data-appearance-dark") || "";
  const defaultName = button.getAttribute("data-appearance-default") || names[0];
  const menu = document.querySelector("[data-appearance-menu]");
  const options = menu ? Array.from(menu.querySelectorAll("[data-appearance-option]")) : [];
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const applied = () => {
    const theme = root.getAttribute("data-theme");
    return theme && names.indexOf(theme) !== -1 ? theme : null;
  };

  // The scheme the visitor is looking at right now: an applied choice, or
  // the operating system preference through the CSS fallback blocks.
  const resolved = () => {
    return applied() || (darkName && media.matches ? darkName : defaultName);
  };

  const apply = (name) => {
    root.setAttribute("data-theme", name);
    writeStored(name);
  };

  const syncOptions = () => {
    options.forEach((option) => {
      option.setAttribute("aria-pressed", String(option.getAttribute("data-appearance-option") === resolved()));
    });
  };

  const syncToggle = () => {
    if (menu) {
      button.setAttribute("aria-expanded", String(!menu.hidden));
      syncOptions();
    } else {
      button.setAttribute("aria-pressed", String(resolved() === darkName));
    }
  };

  button.hidden = false;
  syncToggle();

  // Two schemes: activating the control swaps between them.
  if (!menu) {
    button.addEventListener("click", () => {
      const current = resolved();
      const other = names.find((name) => name !== current) || current;
      apply(other);
      syncToggle();
    });
  }

  // Three or more schemes: the control opens a small scheme menu.
  if (menu) {
    const open = () => {
      menu.hidden = false;
      syncToggle();
      const active = options.find((option) => option.getAttribute("data-appearance-option") === resolved());
      (active || options[0]).focus();
    };
    const close = () => {
      menu.hidden = true;
      syncToggle();
      button.focus();
    };

    button.addEventListener("click", () => {
      if (menu.hidden) {
        open();
      } else {
        close();
      }
    });

    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
        return;
      }
      const current = options.indexOf(document.activeElement);
      if (current === -1) {
        return;
      }
      event.preventDefault();
      const offset = event.key === "ArrowDown" ? 1 : -1;
      options[(current + offset + options.length) % options.length].focus();
    });

    document.addEventListener("click", (event) => {
      if (!menu.hidden && !menu.contains(event.target) && !button.contains(event.target)) {
        menu.hidden = true;
        syncToggle();
      }
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        apply(option.getAttribute("data-appearance-option"));
        close();
      });
    });
  }

  // With no stored choice, keep the control's state in step with live
  // operating-system changes.
  media.addEventListener("change", () => {
    if (!applied() && !readStored(names)) {
      root.removeAttribute("data-theme");
      syncToggle();
    }
  });
}
