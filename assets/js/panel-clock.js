/*
 * radiance — top panel clock applet.
 *
 * Updates the server-rendered build-time fallback to the visitor's local
 * time and keeps it current.
 */

export function initPanelClock() {
  const clocks = document.querySelectorAll("time[data-panel-clock]");
  if (clocks.length === 0) {
    return;
  }

  const update = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const value = `${hours}:${minutes}`;
    clocks.forEach((clock) => {
      clock.textContent = value;
      clock.setAttribute("datetime", value);
    });
  };

  update();
  setInterval(update, 30000);
}
