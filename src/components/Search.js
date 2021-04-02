import React, { useCallback, useEffect } from "react";
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

const Search = ({ setResults, lang }) => {
  const [state, setState] = useSetState({
    section: !DEBUG ? "" : "Torah",
    book: !DEBUG ? "" : "Genesis",
    chapter: !DEBUG ? "" : 1,
    chapters: !DEBUG ? "" : [1],
    regex: !DEBUG ? "" : "\\w",
  });

  const classes = useStyles({ lang });

  const handleSearch = (searchState = undefined) => {
    const mergedState = { ...state, ...searchState };
    const { section, book, chapter, regex } = mergedState;
    if (searchState) {
      setState(searchState);
    }
    search(section, book, chapter, regex).then((results) =>
      setResults(results)
    );
  };

  const onSectionChange = (ev) =>
    setState({
      section: ev.target.value,
      book: "",
      chapters: "",
    });

  const onBookChange = (ev) => {
    numChapters(section, ev.target.value)
      .then((n) => [...Array(n).keys()].map((i) => i + 1))
      .then((chapters) =>
        setState({
          book: ev.target.value,
          chapter: "",
          chapters,
        })
      );
  };

  const onChapterChange = (ev) => setState({ chapter: ev.target.value });
  const onTextChange = (ev) => setState({ regex: ev.target.value });

  const onTextKeyDown = (ev) => {
    if (ev.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (window.location.search) {
      const searchParams = new URLSearchParams(window.location.search);
      const search = {};
      const regex = searchParams.get("rgx");
      if (regex) {
        search.regex = regex;
      }
      handleSearch(search);
    }
  }, []);

  const { section, book, chapter, chapters, regex } = state;
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
        onClick={() => handleSearch()}
        style={{ verticalAlign: "bottom" }}
      >
        {getText("Search", lang)}
      </Button>
    </Paper>
  );
};

export default Search;
