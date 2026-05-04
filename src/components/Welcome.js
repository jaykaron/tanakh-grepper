import React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText as DialogText,
  makeStyles,
} from "@material-ui/core";
import { searchToUrl } from "../utils/url";

const WIKI_URL = "https://en.wikipedia.org/wiki/Regular_expression";
const PAL_URL = "https://www.regexpal.com/";
const SEFARIA_URL = "http://sefaria.org/";
const REGEX_DOCS_URL =
  "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp";
const ISSUES_URL = "https://github.com/jaykaron/tanakh-grepper/issues";

const TRIPLE_REGEX = /(\w)\1\1/.toString().slice(1, -1);
const ALLIT_REGEX = /(^| )(\w)\w+( \2\w+){4,}/.toString().slice(1, -1);

// @ts-ignore - need to override zIndex because ko-fi hard coded theirs and we want
// the ko-fi widget to be under the dialog
const useStyles = makeStyles(() => ({
  main: { zIndex: "999999999!important" },
}));

const Welcome = ({ open, onClose }) => {
  const classes = useStyles();
  return (
    <Dialog
      className={classes.main}
      maxWidth="md"
      fullWidth
      open={open}
      onClose={onClose}
      aria-labelledby="welcome-dialog-title"
    >
      <DialogContent>
        <DialogText variant="h3">
          Welcome to Tanakh Grepper!
        </DialogText>
        <DialogText>
          Tanakh Grepper is a Hebrew-text Tanakh search engine. It can be used to search for exact
          word matches like one would expect. <small>(Ex. search for all occurrences of the word <a href={searchToUrl({ regex: "אדמה" })}>אדמה</a>)</small> 
        </DialogText>
        <DialogText>
          You can also narrow down the search by section, book or chapter. <small>(Ex. Every mention of <a href={searchToUrl({ regex: "בגד", section: "Torah", book: "Genesis" })}>בגד in Genesis</a>)</small>
        </DialogText>
        <DialogText>
          But the real power comes from using regular expressions.
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
          If you aren't familiar with regular expressions, they are a powerful and fairly
          standardized way of specifying text patterns that are often used for complex searches. You can read up about them on{" "}
          <a href={WIKI_URL}>Wikipedia</a> or many other places on the internet. I often use{" "}
          <a href={PAL_URL}>RegexPal</a> to help build complicated expressions.
        </DialogText>
        <DialogText variant="h5">Technical Notes:</DialogText>
        <DialogText>
          <ul>
            <li>
              Text comes from <a href={SEFARIA_URL}>Sefaria.org</a>
            </li>
            <li>
              To facillitate searching in Hebrew <code>\w</code>, <code>\W</code>, <code>\b</code> and <code>\B</code> are opaquely replaced with patterns that work with Hebrew text.
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
