import React, { useState } from "react";
import { Button, IconButton, makeStyles } from "@material-ui/core";
import { GetApp, InfoOutlined } from "@material-ui/icons";
import GithubCorner from "react-github-corner";

import Search from "./components/Search";
import PassukLister from "./components/PassukLister";
import Welcome from "./components/Welcome";
import { DEBUG, REPO_URL } from "./constants";

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
  const [results, setResults] = useState([]);
  const [lang, setLang] = useState("en");
  const [welcomeOpen, setWelcomeOpen] = useState(!DEBUG);
  const [installEvent, setInstallEvent] = useState(null);
  const classes = useStyles();

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    setInstallEvent(event);
  });

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
        <Welcome open={welcomeOpen} onClose={() => setWelcomeOpen(false)} />
        <Search setResults={setResults} lang={lang} />
        <PassukLister lang={lang} passukim={results} />
        <div className={classes.bottomButtons}>
          <IconButton onClick={() => setWelcomeOpen(true)} title="Info">
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
            onClick={() => setLang(lang === "en" ? "he" : "en")}
          >
            {lang === "en" ? "עברית" : "English"}
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
