/*
 * radiance — palette tile copy controls.
 *
 * Progressive enhancement: the labelled Copy buttons render hidden and are
 * revealed by this script. Copying uses the async clipboard API where it
 * is available and falls back to execCommand; failures are reported on the
 * control instead of interrupting the page.
 */

const COPY_FEEDBACK_MS = 2000;

function copyViaExecCommand(value) {
  const area = document.createElement("textarea");
  area.value = value;
  area.setAttribute("readonly", "");
  area.className = "tile__copy-area";
  document.body.appendChild(area);
  area.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  document.body.removeChild(area);
  return copied;
}

function copyText(value) {
  if (window.isSecureContext && window.navigator && window.navigator.clipboard) {
    return window.navigator.clipboard.writeText(value);
  }
  return new Promise((resolve, reject) => {
    if (copyViaExecCommand(value)) {
      resolve();
    } else {
      reject(new Error("copy failed"));
    }
  });
}

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
