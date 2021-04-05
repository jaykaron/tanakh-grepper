import React, { useCallback, useEffect } from "react";
import { Button, IconButton, makeStyles } from "@material-ui/core";
import { GetApp, InfoOutlined } from "@material-ui/icons";
import GithubCorner from "react-github-corner";

import Search from "./components/Search";
import PassukLister from "./components/PassukLister";
import Welcome from "./components/Welcome";
import { DEBUG, REPO_URL } from "./utils/constants";

import logo from "./media/logo.png";
import { useSetState } from "ahooks";
import { stateFromUrl } from "./utils/url";

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
  bottomButtons: {
    position: "fixed",
    bottom: 10,
    left: 10,
    "& > button": {
      marginRight: "0.5rem",
    },
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
    installEvent: null,
  });

  useEffect(() => {
    const urlState = stateFromUrl();
    // only open welcome if query params are empty and DEBUG is false
    setState({ welcomeOpen: Object.values(urlState).length <= 0 && !DEBUG });

    // setState is stable so can be left out of deps array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    setState({ installEvent: event });
  });

  const setResults = useCallback((results) => setState({ results }), [
    setState,
  ]);

  const { results, lang, welcomeOpen, installEvent } = state;
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
        <div className={classes.bottomButtons}>
          <IconButton
            onClick={() => setState({ welcomeOpen: true })}
            title="Info"
          >
            <InfoOutlined />
          </IconButton>
          <IconButton
            disabled={installEvent === null}
            title="Install App"
            onClick={() => installEvent?.prompt?.()}
          >
            <GetApp />
          </IconButton>
          <Button
            variant="contained"
            size="small"
            title="Change Language"
            onClick={() => setState({ lang: lang === "en" ? "he" : "en" })}
          >
            {lang === "en" ? "עברית" : "English"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
