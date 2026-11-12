/*
 * radiance — application entry point.
 *
 * Bundled with Hugo's js.Build. Core content and navigation work without
 * this script; it only applies progressive enhancements.
 */

import { initPanelMenus } from "./panel-menu.js";
import { initPanelClock } from "./panel-clock.js";
import { initWindows } from "./window.js";
import { initWindowHistory } from "./window-history.js";
import { initDesktopShortcuts } from "./desktop-shortcuts.js";

const root = document.documentElement;

// Signal that the application script has initialised successfully.
root.classList.remove("no-js");
root.classList.add("js");

initPanelMenus();
initPanelClock();
initWindows();
initWindowHistory();
initDesktopShortcuts();
