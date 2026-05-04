const loadJsonBook = (section, book, chapter) => {
  const bookData = require(`./jsonText/${section}/${book}.json`);
  const text = bookData["text"];
  if (Number.isInteger(chapter)) {
    return text[chapter - 1];
  }
  return text;
};

/**
 * Replace some of the regex match characters with hebrew equivalents
 */
function hebraicizeRegex(regexStr) {
  // Replace \w / \W outside character classes with [א-ת] / [^א-ת];
  // inside a [...] group, replace with bare ranges so they compose.
  // Replace \b / \B (assertions, never valid inside [...]) with lookaround
  // emulations using the Hebrew word-character definition.
  const hebWord = "א-ת";
  const warnings = [];
  let out = "";
  let inClass = false;
  // Per-class tracking to detect ambiguous \W usage
  let classStart = -1; // index in regexStr of the opening [
  let classNegated = false;
  let classHasW = false;
  let classHasOther = false;
  for (let i = 0; i < regexStr.length; i++) {
    const c = regexStr[i];
    if (c === "\\" && i + 1 < regexStr.length) {
      const next = regexStr[i + 1];
      if (inClass && next === "w") {
        out += hebWord;
        classHasOther = true;
        i++;
        continue;
      }
      if (inClass && next === "W") {
        // Translating \W inside [...] to ^א-ת only works if it's the
        // sole member of the class; otherwise the leading ^ negates
        // the entire class and changes semantics.
        out += "^" + hebWord;
        classHasW = true;
        i++;
        continue;
      }
      if (!inClass && next === "w") {
        out += "[" + hebWord + "]";
        i++;
        continue;
      }
      if (!inClass && next === "W") {
        out += "[^" + hebWord + "]";
        i++;
        continue;
      }
      if (!inClass && next === "b") {
        out +=
          "(?:(?<=[^" +
          hebWord +
          "])(?=[" +
          hebWord +
          "])|(?<=[" +
          hebWord +
          "])(?=[^" +
          hebWord +
          "])|^(?=[" +
          hebWord +
          "])|(?<=[" +
          hebWord +
          "])$)";
        i++;
        continue;
      }
      if (!inClass && next === "B") {
        out +=
          "(?:(?<=[" +
          hebWord +
          "])(?=[" +
          hebWord +
          "])|(?<=[^" +
          hebWord +
          "])(?=[^" +
          hebWord +
          "]))";
        i++;
        continue;
      }
      // Pass through other escapes untouched (e.g. \s, \d, \[, \\)
      out += c + next;
      if (inClass) classHasOther = true;
      i++;
      continue;
    }
    if (!inClass && c === "[") {
      inClass = true;
      classStart = i;
      classNegated = regexStr[i + 1] === "^";
      classHasW = false;
      classHasOther = false;
      out += c;
      continue;
    }
    if (inClass && c === "]") {
      inClass = false;
      if (classHasW && (classHasHebraicizedW(classNegated, classHasOther))) {
        const snippet = regexStr.slice(classStart, i + 1);
        if (classNegated && !classHasOther) {
          warnings.push(
            `'${snippet}' is equivalent to \\w; the negation may not behave as intended after Hebraicization.`
          );
        } else {
          warnings.push(
            `'${snippet}' combines \\W with other class members; the result may not match what you expect after Hebraicization.`
          );
        }
      }
      out += c;
      continue;
    }
    if (inClass) {
      // Track non-\W content. The opening '^' for negation is not content.
      const isNegationMarker = classNegated && i === classStart + 1;
      if (!isNegationMarker) classHasOther = true;
    }
    out += c;
  }
  return { regex: out, warnings };
}

// Helper: did the just-closed class need a warning?
function classHasHebraicizedW(negated, hasOther) {
  return negated || hasOther;
}

const search = async (section, book, chapter, regexStr) => {
  const allOrEmpty = (str) => str === "All" || str === "";

  if (regexStr === "") {
    return [];
  }

  const { regex: hebraicized, warnings } = hebraicizeRegex(regexStr);
  for (const w of warnings) {
    console.warn(`[tanakh-grepper] ${w}`);
  }
  let regex = new RegExp(hebraicized, "g");

  if (allOrEmpty(section)) {
    return searchAll(regex);
  } else if (allOrEmpty(book)) {
    return searchSection(section, regex);
  } else if (allOrEmpty(chapter)) {
    return searchBook(section, book, regex);
  }
  return searchChapter(section, book, chapter, regex);
};

const searchAll = (regex) => {
  let resultPromises = sectionTitles().map((section) =>
    searchSection(section, regex)
  );
  return Promise.all(resultPromises).then((values) => values.flat());
};

const searchSection = (section, regex) => {
  let resultPromises = bookTitles(section).map((book) =>
    searchBook(section, book, regex)
  );
  return Promise.all(resultPromises).then((values) => values.flat());
};

const searchBook = async (section, book, regex) => {
  let text = await loadJsonBook(section, book);

  let matches = [];
  text.forEach((chapter, i) => {
    let chapterMatches = _searchChapter(chapter, regex).map((match) => ({
      ...match,
      section,
      book,
      chapter: i + 1,
    }));
    matches.push(...chapterMatches);
  });
  return matches;
};

const searchChapter = async (section, book, chapter, regex) => {
  let text = await loadJsonBook(section, book, chapter);
  let matches = _searchChapter(text, regex);
  return matches.map((match) => ({ ...match, section, book, chapter }));
};

const _searchChapter = (chapterText, regex) => {
  let matches = [];
  chapterText.forEach((line, j) => {
    let match = searchLine(line, regex);
    if (match) {
      matches.push({ ...match, line: j + 1 });
    }
  });
  return matches;
};

const searchLine = (line, regex) => {
  let matches = [];
  let result = {
    text: line,
    matches,
  };

  let match = regex.exec(line);
  while (match !== null) {
    matches.push({ match: match[0], index: match.index, _match: match });
    match = regex.exec(line);
  }

  if (matches.length === 0) {
    return null;
  }
  return result;
};

const _TOC = {
  Torah: ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"],
  Prophets: [
    "Amos",
    "Jeremiah",
    "Micah",
    "Joel",
    "Nahum",
    "Jonah",
    "Obadiah",
    "Ezekiel",
    "Joshua",
    "Samuel1",
    "Habakkuk",
    "Judges",
    "Samuel2",
    "Haggai",
    "Kings1",
    "Zechariah",
    "Hosea",
    "Kings2",
    "Zephaniah",
    "Isaiah",
    "Malachi",
  ],
  Writings: [
    "Daniel",
    "Job",
    "Psalms",
    "Ecclesiastes",
    "Lamentations",
    "Ruth",
    "Chronicles1",
    "Chronicles2",
    "Esther",
    "Nehemiah",
    "SongOfSongs",
    "Ezra",
    "Proverbs",
  ],
};

const sectionTitles = () => Object.keys(_TOC);
const bookTitles = (section) => _TOC[section] || [];
const numChapters = async (section, book) => {
  if (sectionTitles().includes(section) && bookTitles(section).includes(book)) {
    let bookText = await loadJsonBook(section, book);
    return bookText.length;
  }
  return 0;
};

export { search, sectionTitles, bookTitles, numChapters, hebraicizeRegex };
