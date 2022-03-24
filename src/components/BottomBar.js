import React from "react";
import { Button, IconButton, makeStyles } from "@material-ui/core";
import { GetApp, InfoOutlined } from "@material-ui/icons";
import { useInstallEvent } from "../utils/hooks";
import CopyUrlButton from "./CopyUrlButton";
import SupportButton from "./SupportButton";

const useStyles = makeStyles(() => ({
  bottomButtons: {
    position: "fixed",
    bottom: 13,
    left: 200,
    "& > button": {
      marginRight: "0.2rem",
    },
  },
}));

const BottomBar = ({ lang, onInfoClick, onLangClick }) => {
  const classes = useStyles();
  const installEvent = useInstallEvent();

  return (
    <div className={classes.bottomButtons}>
      <IconButton onClick={onInfoClick} title="Info">
        <InfoOutlined />
      </IconButton>
      <IconButton
        disabled={installEvent === null}
        title="Install App"
        onClick={() => installEvent?.prompt?.()}
      >
        <GetApp />
      </IconButton>
      <CopyUrlButton />
      <Button
        variant="contained"
        size="small"
        title="Change Language"
        onClick={onLangClick}
      >
        {lang === "en" ? "עברית" : "English"}
      </Button>
      <SupportButton />
    </div>
  );
};

export default BottomBar;
