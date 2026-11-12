/*
 * radiance — desktop shortcuts.
 *
 * Progressive enhancement only: clicking a shortcut marks it selected
 * before normal navigation (navigation is never prevented), and Arrow Up
 * and Arrow Down move focus and selection among the shortcuts while focus
 * is already inside the shortcut group. Arrow keys elsewhere are not
 * intercepted, and the shortcuts remain ordinary links without this
 * script.
 */

const SELECTED_CLASS = "is-selected";

export function initDesktopShortcuts() {
  const group = document.querySelector("[data-desktop-shortcuts]");
  if (!group) {
    return;
  }
  const shortcuts = Array.from(group.querySelectorAll("[data-desktop-shortcut]"));
  if (shortcuts.length === 0) {
    return;
  }

  const select = (shortcut) => {
    shortcuts.forEach((other) => {
      other.classList.toggle(SELECTED_CLASS, other === shortcut);
    });
  };

  shortcuts.forEach((shortcut) => {
    shortcut.addEventListener("click", () => {
      select(shortcut);
    });
  });

  group.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }
    if (!group.contains(document.activeElement)) {
      return;
    }
    const current = shortcuts.indexOf(document.activeElement);
    if (current === -1) {
      return;
    }
    event.preventDefault();
    const offset = event.key === "ArrowDown" ? 1 : -1;
    const next = (current + offset + shortcuts.length) % shortcuts.length;
    shortcuts[next].focus();
    select(shortcuts[next]);
  });
}
