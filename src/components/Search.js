import React, { useEffect, useState } from "react";
import { makeStyles, Paper, TextField, Button } from "@material-ui/core";
import { useSetState } from "ahooks";

import Select from "./Select";
import { search, bookTitles, sectionTitles, numChapters } from "../textContent";
import { getText } from "../translation";
import { DEBUG } from "../utils/constants";
import { searchFromUrl, setQueryUrl } from "../utils/url";

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
  select: {
    minWidth: "10ch",
  },
  alignBottom: {
    verticalAlign: "bottom",
  },
});

function useSearch(setResults) {
  const [inputState, setInputState] = useSetState({
    section: !DEBUG ? "" : "Torah",
    book: !DEBUG ? "" : "Genesis",
    chapter: !DEBUG ? "" : 1,
    chapters: !DEBUG ? "" : [1],
    regex: !DEBUG ? "" : "\\w",
  });

  const [searchState, setSearchState] = useState(undefined);
  const triggerSearch = () => setSearchState({ ...inputState });

  useEffect(() => {
    if (searchState) {
      const { section, book, chapter, regex } = searchState;
      search(section || "", book || "", chapter || "", regex)
        .then((results) => {
          window.tgResults = results;
          setResults(results)
        })
        .catch((err) => {
          alert(
            "Oh no! An error occurred!\nIt's likely that your regular expression was malformed. Check the dev console for more details."
          );
          console.log(err);
        });
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
    numChapters(inputState.section, ev.target.value)
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

  // parse searchParams on mount and set state accordingly
  useEffect(() => {
    const search = searchFromUrl();
    if (Object.values(search).length > 0) {
      setInputState(search);
      setSearchState(search);
    }
  }, [setInputState]);

  // update number of chapters on book change
  useEffect(() => {
    numChapters(inputState.section, inputState.book)
      .then((n) => [...Array(n).keys()].map((i) => i + 1))
      .then((chapters) => setInputState({ chapters }));
  }, [inputState.section, inputState.book, setInputState]);

  return {
    inputState,
    onSectionChange,
    onBookChange,
    onChapterChange,
    onTextChange,
    onTextKeyDown,
    triggerSearch,
  };
}

const Search = ({ setResults, lang }) => {
  const classes = useStyles({ lang });

  const {
    inputState,
    onSectionChange,
    onBookChange,
    onChapterChange,
    onTextChange,
    onTextKeyDown,
    triggerSearch,
  } = useSearch(setResults);

  const { section, book, chapter, chapters, regex } = inputState;
  return (
    <Paper elevation={3} className={classes.root}>
      <Select
        label="Section"
        options={sectionTitles()}
        reliesOn="None"
        lang={lang}
        className={classes.select}
        value={section}
        onValueChange={onSectionChange}
      />
      <Select
        label="Book"
        options={bookTitles(section)}
        reliesOn={section}
        lang={lang}
        className={classes.select}
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
        className={classes.select}
      />
      <TextField
        value={regex}
        onChange={onTextChange}
        InputProps={{ classes: { root: classes.search } }}
        onKeyDown={onTextKeyDown}
        className={classes.alignBottom}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={triggerSearch}
        className={classes.alignBottom}
      >
        {getText("Search", lang)}
      </Button>
    </Paper>
  );
};

export default Search;
