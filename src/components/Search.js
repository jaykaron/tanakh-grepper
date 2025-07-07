import React, { useEffect, useState } from "react";
import { makeStyles, Paper, TextField, Button, Menu, MenuItem, IconButton } from "@material-ui/core";
import { History } from "@material-ui/icons";
import { useSetState } from "ahooks";

import Select from "./Select";
import { search, bookTitles, sectionTitles, numChapters } from "../textContent";
import { getText } from "../translation";
import { DEBUG } from "../utils/constants";
import { searchFromUrl, setQueryUrl } from "../utils/url";
import { getSearchHistory, addToSearchHistory } from "../utils/searchHistory";

const useStyles = makeStyles({
  root: {
    direction: (props) => (props.lang === "en" ? "ltr" : "rtl"),
    zIndex: 1,
    marginTop: "1rem",
    paddingLeft: "2rem",
    paddingRight: "2rem",
    paddingBottom: "1.5rem",
    width: "100%",
    maxWidth: "770px",
    boxSizing: "border-box",
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
  searchContainer: {
    display: "flex",
    alignItems: "flex-end",
    gap: "0.5rem",
  },
  textField: {
    flex: 1,
  },
  historyButton: {
    padding: "4px",
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
  const triggerSearch = () => {
    if (inputState.regex?.trim()) {
      addToSearchHistory(inputState.regex.trim());
    }
    setSearchState({ ...inputState });
  };

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
    setInputState,
  };
}

const Search = ({ setResults, lang }) => {
  const classes = useStyles({ lang });
  const [historyAnchorEl, setHistoryAnchorEl] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const {
    inputState,
    onSectionChange,
    onBookChange,
    onChapterChange,
    onTextChange,
    onTextKeyDown,
    triggerSearch,
    setInputState,
  } = useSearch(setResults);

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  const handleHistoryClick = (event) => {
    setHistoryAnchorEl(event.currentTarget);
    setSearchHistory(getSearchHistory());
  };

  const handleHistoryClose = () => {
    setHistoryAnchorEl(null);
  };

  const handleHistorySelect = (query) => {
    setInputState({ regex: query });
    handleHistoryClose();
  };

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
      <div className={classes.searchContainer}>
        <IconButton
          onClick={handleHistoryClick}
          className={classes.historyButton}
          size="small"
          title={getText("Search History", lang)}
        >
          <History />
        </IconButton>
        <Menu
          anchorEl={historyAnchorEl}
          open={Boolean(historyAnchorEl)}
          onClose={handleHistoryClose}
          PaperProps={{
            style: {
              maxHeight: 300,
              width: '300px',
            },
          }}
        >
          {searchHistory.length === 0 ? (
            <MenuItem disabled>
              {getText("No search history", lang)}
            </MenuItem>
          ) : (
            searchHistory.map((query) => (
              <MenuItem
                key={query}
                onClick={() => handleHistorySelect(query)}
                style={{
                  fontFamily: "Menlo, Monaco, monospace",
                  fontSize: "0.9rem",
                }}
              >
                {query}
              </MenuItem>
            ))
          )}
        </Menu>
        <TextField
          value={regex}
          onChange={onTextChange}
          InputProps={{ classes: { root: classes.search } }}
          onKeyDown={onTextKeyDown}
          className={classes.textField}
        />
      <Button
        variant="contained"
        color="primary"
        onClick={triggerSearch}
        className={classes.alignBottom}
      >
        {getText("Search", lang)}
      </Button>
      </div>
    </Paper>
  );
};

export default Search;
