import React, { useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import GithubCorner from "react-github-corner";
import { useSetState } from "ahooks";

import { DEBUG, REPO_URL } from "./utils/constants";
import { searchFromUrl } from "./utils/url";

import Search from "./components/Search";
import PassukLister from "./components/PassukLister";
import Welcome from "./components/Welcome";
import BottomBar  from "./components/BottomBar";

import logo from "./media/logo.png";

const useStyles = makeStyles(() => ({
  main: {
    textAlign: "center",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "90%",
    margin: "auto",
  },
  logo: {
    position: "absolute",
    top: 0,
    right: 10,
    width: 75,
  },
}));

function App() {
  const classes = useStyles();

  const [state, setState] = useSetState({
    results: [],
    lang: "en",
    welcomeOpen: false,
  });

  useEffect(() => {
    const urlState = searchFromUrl();
    // only open welcome if query params are empty and DEBUG is false
    setState({ welcomeOpen: Object.values(urlState).length <= 0 && !DEBUG });
  }, [setState]);

  const setResults = useCallback((results) => setState({ results }), [
    setState,
  ]);

  const { results, lang, welcomeOpen } = state;
  return (
    <>
      <GithubCorner
        href={REPO_URL}
        bannerColor="#151513"
        octoColor="#fff"
        size={80}
        direction="left"
      />
      <img src={logo} className={classes.logo} alt="logo" />
      <div className={classes.main}>
        <Welcome
          open={welcomeOpen}
          onClose={() => setState({ welcomeOpen: false })}
        />
        <Search setResults={setResults} lang={lang} />
        <PassukLister lang={lang} passukim={results} />
        <BottomBar
          lang={lang}
          onInfoClick={() => setState({ welcomeOpen: true })}
          onLangClick={() => setState({ lang: lang === "en" ? "he" : "en" })}
        />
      </div>
    </>
  );
}

export default App;
