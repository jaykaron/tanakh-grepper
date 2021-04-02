export function stateFromUrl() {
  if (window.location.search) {
    const searchParams = new URLSearchParams(window.location.search);
    const search = {};
    const regex = searchParams.get("regex");
    if (regex) {
      search.regex = regex;
    }
    const section = searchParams.get("section");
    if (section) {
      search.section = section;
      search.book = "";
      search.chapter = "";
    }
    const book = searchParams.get("book");
    if (book) {
      search.book = book;
    }
    const chapter = searchParams.get("chapter");
    if (chapter) {
      search.chapter = chapter;
    }
    return search;
  }
  return {};
}

export function setQueryUrl(search) {
  const location = window.location;

  const searchParams = new URLSearchParams(location.search);
  searchParams.set("regex", search.regex);
  searchParams.set("section", search.section || "");
  searchParams.set("book", search.book || "");
  searchParams.set("chapter", search.chapter || "");

  const newUrl = `${location.protocol}//${location.host}${
    location.pathname
  }?${searchParams.toString()}`;
  window.history.pushState({ path: newUrl }, "", newUrl);
}
