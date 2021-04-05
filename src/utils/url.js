import { bookTitles, sectionTitles } from "../textContent";

export function stateFromUrl() {
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

export function setQueryUrl(search) {
  const loc = window.location;

  const searchParams = new URLSearchParams(loc.search);
  searchParams.set("regex", search.regex);
  searchParams.set("section", search.section || "");
  searchParams.set("book", search.book || "");
  searchParams.set("chapter", search.chapter || "");

  const newUrl = `${loc.protocol}//${loc.host}${
    loc.pathname
  }?${searchParams.toString()}`;
  window.history.pushState({ path: newUrl }, "", newUrl);
}
