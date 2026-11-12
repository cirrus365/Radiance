/*
 * radiance — application windows.
 *
 * Progressive enhancement for the titlebar controls. Without this script
 * the controls stay hidden and the full window body remains visible.
 *
 * Minimise toggles the window body and mirrors the state in aria-expanded;
 * when the page has a single window, the bottom-panel entry (marked with
 * data-window-restore) restores a minimised window on activation, by mouse
 * or keyboard, and reflects the minimised state with an is-minimised
 * class. Maximise toggles window--maximised on the current window and
 * has-maximised-window on <html> (one maximised window at a time) and
 * mirrors the state in aria-pressed. Close is a plain link and needs no
 * script.
 */

const MAXIMISED_HTML_CLASS = "has-maximised-window";
const MAXIMISED_WINDOW_CLASS = "window--maximised";
const MINIMISED_ENTRY_CLASS = "is-minimised";

export function initWindows() {
  const windows = document.querySelectorAll(".window");
  const root = document.documentElement;
  const restoreLink = windows.length === 1 ? document.querySelector("[data-window-restore]") : null;

  windows.forEach((win) => {
    const body = win.querySelector(".window__content");
    const minimise = win.querySelector(".window__control--minimise");
    const maximise = win.querySelector(".window__control--maximise");

    if (minimise && body) {
      const setMinimised = (minimised) => {
        minimise.setAttribute("aria-expanded", String(!minimised));
        body.hidden = minimised;
        if (restoreLink) {
          restoreLink.classList.toggle(MINIMISED_ENTRY_CLASS, minimised);
        }
      };

      minimise.addEventListener("click", () => {
        setMinimised(!body.hidden);
      });

      if (restoreLink) {
        restoreLink.addEventListener("click", (event) => {
          if (body.hidden) {
            event.preventDefault();
            setMinimised(false);
          }
        });
      }
    }

    if (maximise) {
      maximise.addEventListener("click", () => {
        const pressed = maximise.getAttribute("aria-pressed") === "true";
        if (!pressed) {
          windows.forEach((other) => {
            if (other !== win) {
              other.classList.remove(MAXIMISED_WINDOW_CLASS);
              const otherMaximise = other.querySelector(".window__control--maximise");
              if (otherMaximise) {
                otherMaximise.setAttribute("aria-pressed", "false");
              }
            }
          });
        }
        win.classList.toggle(MAXIMISED_WINDOW_CLASS, !pressed);
        maximise.setAttribute("aria-pressed", String(!pressed));
        root.classList.toggle(MAXIMISED_HTML_CLASS, document.querySelector("." + MAXIMISED_WINDOW_CLASS) !== null);
      });
    }
  });
}
