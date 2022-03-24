import React, { useState } from "react";
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  Paper,
  makeStyles,
} from "@material-ui/core";
import { Launch as LaunchIcon } from "@material-ui/icons";

import { getText } from "../translation";
import { generateSefariaUrl } from "../utils/url";

const useStyles = makeStyles({
  table: {
    direction: (props) => (props.lang === "en" ? "ltr" : "rtl"),
    width: "100%",
    maxWidth: "75rem",
    maxHeight: "60vh",
  },
  caption: {
    direction: (props) => (props.lang === "en" ? "ltr" : "rtl"),
  },
});

const rowsPerPage = 30;

const PassukLister = ({ passukim, lang }) => {
  const [page, setPage] = useState(0);

  const en = lang === "en";
  const classes = useStyles({ lang });

  if (passukim.length === 0) {
    return null;
  }

  return (
    <div>
      <TablePagination
        classes={{ caption: classes.caption }}
        component="div"
        count={passukim.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={(event, newPage) => setPage(newPage)}
        rowsPerPageOptions={[rowsPerPage]}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to === -1 ? count : to} ${getText("of", lang)}
            ${count !== -1 ? count : `${getText("more than", lang)} ${to}`}`
        }
      />
      <TableContainer component={Paper} className={classes.table}>
        <Table stickyHeader aria-label="results table" size="small">
          <TableHead>
            <TableRow>
              <TableCell align={en ? "left" : "right"}>
                {getText("Book", lang)}
              </TableCell>
              <TableCell align="center">{getText("Verse", lang)}</TableCell>
              <TableCell align="center">{getText("Text", lang)}</TableCell>
              <TableCell align="center">Sefaria</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {passukim
              .slice(rowsPerPage * page, rowsPerPage * (page + 1))
              .map(({ book, chapter, line, matches, text }, i) => (
                <TableRow key={i}>
                  <TableCell align={en ? "left" : "right"}>
                    {getText(book, lang)}
                  </TableCell>
                  <TableCell align="left">
                    {chapter}:{line}
                  </TableCell>
                  <TableCell align="right">
                    {boldMatch(text, matches)}
                  </TableCell>
                  <TableCell align="center">
                    <a
                      href={generateSefariaUrl(book, chapter, line)}
                      target="sefaria"
                      rel="noopener"
                    >
                      <LaunchIcon fontSize="small" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

function boldMatch(text, matches) {
  let result = "";
  let trailingIndex = 0;
  for (let i = 0; i < matches.length; i++) {
    const index = matches[i].index;
    const len = matches[i].match.length;

    result += text.slice(trailingIndex, index);
    result += "<b>";
    result += text.slice(index, index + len);
    result += "</b>";
    trailingIndex = index + len;
  }
  result += text.slice(trailingIndex);

  return <span dangerouslySetInnerHTML={{ __html: result }} />;
}

export default PassukLister;
