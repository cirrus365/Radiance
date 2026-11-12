/*
 * radiance — early appearance application.
 *
 * Loaded as a small blocking script in the document head so a stored
 * explicit choice (Radiance or Ambiance) applies before first paint,
 * minimising a flash of the wrong theme. The preference lives in
 * localStorage only; it is never sent to a server. Without a stored
 * choice the page follows prefers-color-scheme through CSS. The full
 * appearance control is wired by the deferred application script.
 */

(function () {
  "use strict";

  var mode = null;
  try {
    mode = window.localStorage.getItem("radiance-appearance");
  } catch (error) {
    mode = null;
  }
  if (mode === "light" || mode === "dark") {
    document.documentElement.setAttribute("data-appearance", mode);
  }
})();
