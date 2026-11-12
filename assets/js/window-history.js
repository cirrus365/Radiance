/*
 * radiance — bottom panel window list history.
 *
 * Tracks up to six visited pages per browser session in sessionStorage,
 * oldest first, and renders them as entries before the server-rendered
 * active entry. Each rendered entry has a labelled Remove button that only
 * removes the entry from the list. Storage is optional: when it is
 * unavailable or blocked, the list falls back to the active entry only.
 */

const STORAGE_KEY = "radiance-window-history";
const MAX_HISTORY = 6;

function readHistory() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item) => {
      if (!item || typeof item.title !== "string" || typeof item.url !== "string") {
        return false;
      }
      try {
        const url = new URL(item.url, window.location.href);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    });
  } catch {
    return [];
  }
}

function writeHistory(history) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Storage unavailable or blocked; the list still works for this view.
  }
}

export function initWindowHistory() {
  const list = document.querySelector("[data-window-list]");
  const activeEntry = list ? list.querySelector("[data-window-entry]") : null;
  const activeLink = activeEntry ? activeEntry.querySelector("a") : null;
  const status = document.querySelector("[data-window-list-status]");
  if (!list || !activeEntry || !activeLink) {
    return;
  }

  const announce = (message) => {
    if (status) {
      status.textContent = message;
    }
  };

  const current = {
    title: activeLink.textContent.trim(),
    url: new URL(activeLink.getAttribute("href"), window.location.href).href,
  };

  const history = readHistory();
  const existing = history.findIndex((item) => item.url === current.url);
  if (existing !== -1) {
    history.splice(existing, 1);
  }
  history.push(current);
  while (history.length > MAX_HISTORY) {
    history.shift();
  }
  writeHistory(history);

  let added = 0;
  readHistory().forEach((item) => {
    if (item.url === current.url) {
      return;
    }
    added += 1;

    const entry = document.createElement("li");
    entry.className = "window-list__entry";

    const link = document.createElement("a");
    link.className = "window-list__link";
    link.href = item.url;
    link.textContent = item.title;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "window-list__remove";
    remove.setAttribute("aria-label", "Remove " + item.title);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "window-list__remove-glyph");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#radiance-glyph-close");
    svg.appendChild(use);
    remove.appendChild(svg);

    remove.addEventListener("click", () => {
      entry.remove();
      announce("Entry removed.");
      writeHistory(readHistory().filter((stored) => stored.url !== item.url));
    });

    entry.appendChild(link);
    entry.appendChild(remove);
    list.insertBefore(entry, activeEntry);
  });

  if (added > 0) {
    announce(added === 1 ? "1 earlier page added to the window list." : added + " earlier pages added to the window list.");
  }
}
