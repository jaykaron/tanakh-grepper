import { bookTitles, sectionTitles } from "../textContent";

export function searchFromUrl() {
  if (window.location.search) {
    const searchParams = new URLSearchParams(window.location.search);
    const search = {};
    const regex = searchParams.get("regex");
    if (regex) {
      search.regex = regex;
    }
    const section = searchParams.get("section");
    if (section && sectionTitles().includes(section)) {
      search.section = section;
      search.book = "";
      search.chapter = "";

      const book = searchParams.get("book");
      if (book && bookTitles(section).includes(book)) {
        search.book = book;

        const chapter = searchParams.get("chapter");
        if (chapter && parseInt(chapter)) {
          search.chapter = parseInt(chapter);
        }
      }
    }
    return search;
  }
  return {};
}

/**
 * Generates a URL given a search.
 * @param {any} search
 */
export function searchToUrl({ regex, section, book, chapter }) {
  const loc = window.location;
  const searchParams = new URLSearchParams();
  searchParams.set("regex", regex);
  searchParams.set("section", section || "");
  searchParams.set("book", book || "");
  searchParams.set("chapter", chapter || "");

  return `${loc.protocol}//${loc.host}${
    loc.pathname
  }?${searchParams.toString()}`;
}

export function setQueryUrl(search) {
  const newUrl = searchToUrl(search);
  window.history.pushState({ path: newUrl }, "", newUrl);
}
