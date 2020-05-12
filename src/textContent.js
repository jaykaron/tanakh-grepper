
const loadJsonBook = (section, book, chapter) => {
  const bookData = require(`./jsonText/${section}/${book}.json`)
  const text = bookData['text']
  if (Number.isInteger(chapter)) {
    return text[chapter - 1]
  }
  return text
}

/**
 * Replace some of the regex match characters with hebrew equivalents
 */
function hebraicizeRegex(regexStr) {
  return regexStr
    .replace(/\\w/g, '[א-ת]')
    .replace(/\\W/g, '[^א-ת0-9_]')
}

const search = async (section, book, chapter, regexStr) => {
  const allOrEmpty = str => str === 'All' || str === ''

  let regex = new RegExp(hebraicizeRegex(regexStr), 'g')

  if (allOrEmpty(section)) {
    return searchAll(regex)
  } else if (allOrEmpty(book)) {
    return searchSection(section, regex)
  } else if (allOrEmpty(chapter)) {
    return searchBook(section, book, regex)
  }
  return searchChapter(section, book, chapter, regex)
}

const searchAll = regex => {
  let resultPromises = sectionTitles().map(section => searchSection(section, regex))
  return Promise.all(resultPromises)
    .then(values => values.flat())
}

const searchSection = (section, regex) => {
  let resultPromises = bookTitles(section).map(book => searchBook(section, book, regex))
  return Promise.all(resultPromises)
    .then(values => values.flat())
}

const searchBook = async (section, book, regex) => {
  let text = await loadJsonBook(section, book)

  let matches = []
  text.forEach((chapter, i) => {
    let chapterMatches = _searchChapter(chapter, regex)
      .map(match => ({ ...match, section, book, chapter: i + 1 }))
    matches.push(...chapterMatches)
  })
  return matches
}

const searchChapter = async (section, book, chapter, regex) => {
  let text = await loadJsonBook(section, book, chapter)
  let matches = _searchChapter(text, regex)
  return matches.map(match => ({ ...match, section, book, chapter }))
}

const _searchChapter = (chapterText, regex) => {
  let matches = []
  chapterText.forEach((line, j) => {
    let match = searchLine(line, regex)
    if (match) {
      matches.push({ ...match, line: j + 1 })
    }
  })
  return matches
}

const searchLine = (line, regex) => {
  let match = regex.exec(line)
  if (match) {
    return { match: match[0], text: match.input, index: match.index }
  }
}

const _TOC = {
  'Torah': ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'],
  'Prophets': ['Amos', 'Jeremiah', 'Micah', 'Joel', 'Nahum',
    'Jonah', 'Obadiah', 'Ezekiel', 'Joshua', 'Samuel1',
    'Habakkuk', 'Judges', 'Samuel2', 'Haggai', 'Kings1', 'Zechariah',
    'Hosea', 'Kings2', 'Zephaniah', 'Isaiah', 'Malachi'],
  'Writings': ['Daniel', 'Job', 'Psalms', 'Ecclesiastes', 'Lamentations', 'Ruth',
    'Chronicles1', 'Chronicles2',
    'Esther', 'Nehemiah', 'SongOfSongs', 'Ezra', 'Proverbs']
}

const sectionTitles = () => Object.keys(_TOC)
const bookTitles = section => _TOC[section] || []
const numChapters = async (section, book) => {
  if (sectionTitles().includes(section) && bookTitles(section).includes(book)) {
    let bookText = await loadJsonBook(section, book)
    return bookText.length
  }
  return 0
}

export { search, sectionTitles, bookTitles, numChapters }
