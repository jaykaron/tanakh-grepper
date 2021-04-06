import React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText as DialogText,
} from "@material-ui/core";
import { searchToUrl } from "../utils/url";

const WIKI_URL = "https://en.wikipedia.org/wiki/Regular_expression";
const BLOG_URL = "https://codular.com/regex";
const PAL_URL = "https://www.regexpal.com/";
const SEFARIA_URL = "http://sefaria.org/";
const REGEX_DOCS_URL =
  "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp";
const ISSUES_URL = "https://github.com/jaykaron/tanakh-grepper/issues";

const TRIPLE_REGEX = /(\w)\1\1/.toString().slice(1, -1);
const ALLIT_REGEX = /(^| )(\w)\w+( \2\w+){4,}/.toString().slice(1, -1);

const Welcome = ({ open, onClose }) => {
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={open}
      onClose={onClose}
      aria-labelledby="welcome-dialog-title"
    >
      <DialogContent>
        <DialogText variant="h3">
          Welcome to a new way to search Tanakh!
        </DialogText>
        <DialogText>
          Welcome to the site made for people who were just not satisfied with
          the current options to search through Tanakh (and who have working
          experience with regular expressions).
        </DialogText>
        <DialogText>
          Like what if you want to find all the times a letter appears 3 times
          in a row within one word? Simple:{" "}
          <code>
            <a href={searchToUrl({ regex: TRIPLE_REGEX })}>{TRIPLE_REGEX}</a>
          </code>{" "}
          and bam.
        </DialogText>
        <DialogText>
          The passuk אמר אויב ארדף אשיג אחלק שלל is famous for its alliteration
          but what if there are more alliterative passukim? How would you find
          them?
          <small>
            {" "}
            Try out{" "}
            <code>
              <a href={searchToUrl({ regex: ALLIT_REGEX })}>{ALLIT_REGEX}</a>
            </code>
          </small>
        </DialogText>
        <DialogText>
          If you aren't familiar with regular expressions, they are a powerful
          way of finding patterns in text. You can read up about them on{" "}
          <a href={WIKI_URL}>Wikipedia</a> or this{" "}
          <a href={BLOG_URL}>random blog post</a>. I often use{" "}
          <a href={PAL_URL}>RegexPal</a> to help build complicated expressions.
        </DialogText>
        <DialogText variant="h5">Technical Notes:</DialogText>
        <DialogText>
          <ul>
            <li>
              Text comes from <a href={SEFARIA_URL}>Sefaria.org</a>
            </li>
            <li>
              To facillitate searching in Hebrew <code>\w</code> gets replaced
              with <code>[א-ת]</code>
            </li>
            <li>
              Searching is done in JavaScript. Read the{" "}
              <a href={REGEX_DOCS_URL}>docs</a> for the fine details
            </li>
            <li>
              You can leave comments or issues on{" "}
              <a href={ISSUES_URL}>GitHub</a>
            </li>
          </ul>
        </DialogText>
      </DialogContent>
    </Dialog>
  );
};

export default Welcome;
