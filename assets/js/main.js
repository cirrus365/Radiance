/*
 * radiance — application entry point.
 *
 * Bundled with Hugo's js.Build. Core content and navigation work without
 * this script; it only applies progressive enhancements.
 */

import { initDesktopShortcuts } from "./desktop-shortcuts.js";
import { initPaletteCopy } from "./palette-copy.js";
import { initSearch } from "./search.js";
import { initAppearance } from "./appearance.js";

const root = document.documentElement;

// Signal that the application script has initialised successfully.
root.classList.remove("no-js");
root.classList.add("js");

initDesktopShortcuts();
initPaletteCopy();
initSearch();
initAppearance();
