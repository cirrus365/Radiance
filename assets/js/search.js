/*
 * radiance — search dialog.
 *
 * Progressive enhancement for the search field. Without this script the
 * field stays hidden and the server-rendered list of links remains fully
 * usable. The script fetches the build-time JSON index, filters
 * case-insensitively over title and summary with a short debounce, shows
 * at most 20 filtered results, and announces the result count in the
 * dialog's aria-live status line. Result text is rendered with DOM APIs
 * and textContent only; no untrusted HTML is inserted.
 */

const DEBOUNCE_MS = 120;
const MAX_RESULTS = 20;

export function initSearch() {
  const field = document.querySelector("[data-search-input]");
  const fieldset = document.querySelector("[data-search-fieldset]");
  const results = document.querySelector("[data-search-results]");
  const status = document.querySelector("[data-search-status]");
  if (!field || !fieldset || !results || !status) {
    return;
  }

  const indexUrl = field.getAttribute("data-search-index");
  if (!indexUrl) {
    return;
  }

  fieldset.hidden = false;
  status.hidden = false;
  status.textContent = "Showing all pages.";

  let index = null;
  let timer = null;

  window.fetch(indexUrl).then((response) => {
    if (!response.ok) {
      throw new Error("index request failed");
    }
    return response.json();
  }).then((data) => {
    index = Array.isArray(data) ? data : [];
    field.addEventListener("input", () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(filter, DEBOUNCE_MS);
    });
  }).catch(() => {
    status.textContent = "Live filtering is unavailable; the links below still work.";
  });

  function renderRows(entries) {
    const list = document.createElement("ul");
    list.className = "dialog__list";
    entries.forEach((entry) => {
      const row = document.createElement("li");
      row.className = "dialog-row";
      const link = document.createElement("a");
      link.className = "dialog-row__link";
      link.href = entry.href;
      const body = document.createElement("span");
      body.className = "dialog-row__body";
      const title = document.createElement("span");
      title.className = "dialog-row__title";
      title.textContent = entry.title;
      body.appendChild(title);
      let description = (entry.section || "") + " · " + (entry.date || "");
      if (entry.summary) {
        description += " — " + entry.summary;
      }
      const descriptionNode = document.createElement("span");
      descriptionNode.className = "dialog-row__description";
      descriptionNode.textContent = description;
      body.appendChild(descriptionNode);
      link.appendChild(body);
      row.appendChild(link);
      list.appendChild(row);
    });
    results.replaceChildren(list);
  }

  function renderEmpty(query) {
    const message = document.createElement("p");
    message.className = "dialog__empty";
    message.textContent = "No matches for “" + query + "”.";
    results.replaceChildren(message);
  }

  function filter() {
    if (index === null) {
      return;
    }
    const query = field.value.trim().toLowerCase();
    if (query === "") {
      renderRows(index);
      status.textContent = index.length === 1 ? "Showing 1 page." : "Showing " + index.length + " pages.";
      return;
    }
    const matches = index.filter((entry) => {
      const haystack = (entry.title + " " + entry.summary).toLowerCase();
      return haystack.includes(query);
    }).slice(0, MAX_RESULTS);
    if (matches.length === 0) {
      renderEmpty(field.value.trim());
      status.textContent = "No results.";
      return;
    }
    renderRows(matches);
    status.textContent = matches.length === 1 ? "1 result." : matches.length + " results.";
  }
}
