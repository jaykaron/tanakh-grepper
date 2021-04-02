import React, { useEffect, useState } from "react";
import { makeStyles, Paper, TextField, Button } from "@material-ui/core";
import { useSetState } from "ahooks";

import Select from "./Select";
import { search, bookTitles, sectionTitles, numChapters } from "../textContent";
import { getText } from "../translation";
import { DEBUG } from "../constants";

const useStyles = makeStyles({
  root: {
    direction: (props) => (props.lang === "en" ? "ltr" : "rtl"),
    zIndex: 1,
    marginTop: "1rem",
    paddingLeft: "2rem",
    paddingRight: "2rem",
    paddingBottom: "1.5rem",
    "& > *": {
      marginLeft: "0.5rem",
      marginRight: "0.5rem",
      marginTop: "1rem",
    },
  },
  search: {
    fontFamily: "Menlo, Monaco, monospace",
    fontWeight: "bold",
  },
});

function setQueryUrl(search) {
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

const Search = ({ setResults, lang }) => {
  const classes = useStyles({ lang });

  const [inputState, setInputState] = useSetState({
    section: !DEBUG ? "" : "Torah",
    book: !DEBUG ? "" : "Genesis",
    chapter: !DEBUG ? "" : 1,
    chapters: !DEBUG ? "" : [1],
    regex: !DEBUG ? "" : "\\w",
  });

  const [searchState, setSearchState] = useState(undefined);
  const triggerSearch = () => setSearchState(inputState);

  useEffect(() => {
    if (searchState) {
      const { section, book, chapter, regex } = searchState;
      search(section || "", book || "", chapter || "", regex).then((results) =>
        setResults(results)
      );
      setQueryUrl(searchState);
    }
  }, [searchState, setResults]);

  const onSectionChange = (ev) =>
    setInputState({
      section: ev.target.value,
      book: "",
      chapters: "",
    });

  const onBookChange = (ev) => {
    numChapters(section, ev.target.value)
      .then((n) => [...Array(n).keys()].map((i) => i + 1))
      .then((chapters) =>
        setInputState({
          book: ev.target.value,
          chapter: "",
          chapters,
        })
      );
  };

  const onChapterChange = (ev) => setInputState({ chapter: ev.target.value });
  const onTextChange = (ev) => setInputState({ regex: ev.target.value });

  const onTextKeyDown = (ev) => {
    if (ev.key === "Enter") {
      triggerSearch();
    }
  };

  useEffect(() => {
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
      setInputState(search);
      setSearchState(search);
    }
  }, []);

  const { section, book, chapter, chapters, regex } = inputState;
  return (
    <Paper elevation={3} className={classes.root}>
      <Select
        label="Section"
        options={sectionTitles()}
        reliesOn="None"
        lang={lang}
        style={{ minWidth: "8ch" }}
        value={section}
        onValueChange={onSectionChange}
      />
      <Select
        label="Book"
        options={bookTitles(section)}
        reliesOn={section}
        lang={lang}
        style={{ minWidth: "8ch" }}
        value={book}
        onValueChange={onBookChange}
      />
      <Select
        label="Chapter"
        options={chapters}
        reliesOn={book}
        value={chapter}
        onValueChange={onChapterChange}
        lang={lang}
        style={{ minWidth: "8ch" }}
      />
      <TextField
        value={regex}
        onChange={onTextChange}
        InputProps={{ classes: { root: classes.search } }}
        onKeyDown={onTextKeyDown}
        style={{ verticalAlign: "bottom" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={triggerSearch}
        style={{ verticalAlign: "bottom" }}
      >
        {getText("Search", lang)}
      </Button>
    </Paper>
  );
};

export default Search;
