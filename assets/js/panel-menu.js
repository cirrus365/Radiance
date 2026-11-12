/*
 * radiance — top panel menus.
 *
 * Progressive enhancement for the <details>-based panel menus: Escape
 * closes the open menu and returns focus to its summary, and opening one
 * menu closes the others. The menus open and work without this script, and
 * the native open state carries the accessibility information.
 */

export function initPanelMenus() {
  const menus = document.querySelectorAll("[data-panel-menu]");

  menus.forEach((menu) => {
    const summary = menu.querySelector("summary");

    menu.addEventListener("toggle", () => {
      if (!menu.open) {
        return;
      }
      menus.forEach((other) => {
        if (other !== menu) {
          other.open = false;
        }
      });
    });

    menu.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !menu.open) {
        return;
      }
      event.preventDefault();
      menu.open = false;
      summary.focus();
    });
  });
}
