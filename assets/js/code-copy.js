/*
 * radiance — code block copy controls.
 *
 * Progressive enhancement: each code block in a window gains a small
 * labelled Copy button, injected by this script so nothing renders
 * without JavaScript. The button sits on a wrapper around the block (so
 * it stays pinned while the code scrolls horizontally) and reports the
 * outcome on the control itself.
 */

const COPY_FEEDBACK_MS = 2000;

import { copyText } from "./clipboard.js";

export function initCodeCopy() {
  document.querySelectorAll(".window__content pre").forEach((pre) => {
    if (pre.textContent.trim() === "") {
      return;
    }
    const value = pre.textContent;
    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    pre.replaceWith(wrapper);
    wrapper.appendChild(pre);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy";
    button.textContent = "Copy";
    wrapper.appendChild(button);

    button.addEventListener("click", () => {
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
