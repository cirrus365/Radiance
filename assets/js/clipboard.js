/*
 * radiance — shared clipboard helper.
 *
 * Copying uses the async clipboard API where it is available and falls
 * back to execCommand; callers report the outcome on their own controls.
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

export function copyText(value) {
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
