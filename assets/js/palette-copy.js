/*
 * radiance — palette tile copy controls.
 *
 * Progressive enhancement: the labelled Copy buttons render hidden and are
 * revealed by this script. Copying goes through the shared clipboard
 * helper (see clipboard.js); failures are reported on the control instead
 * of interrupting the page.
 */

const COPY_FEEDBACK_MS = 2000;

import { copyText } from "./clipboard.js";

export function initPaletteCopy() {
  document.querySelectorAll("[data-copy-value]").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-copy-value");
      const original = button.textContent;
      const feedback = (text) => {
        button.textContent = text;
        window.setTimeout(() => {
          button.textContent = original;
        }, COPY_FEEDBACK_MS);
      };
      copyText(value).then(
        () => feedback("Copied"),
        () => feedback("Copy failed")
      );
    });
  });
}
