
const loadJsonBook = (section, book, chapter) => {
  const bookData = require(`./jsonText/${section}/${book}.json`)
  const text = bookData['text']
  if (Number.isInteger(chapter)) {
    return [text[chapter]]
  }
  return text
}


const searchBook = async (section, book, regexStr) => {
  let text = await loadJsonBook(section, book)
  let regex = new RegExp(regexStr, 'g')

  let matches = []
  text.forEach((chapter, i) => {
    let chapterMatches = searchChapter(chapter, regex)
    chapterMatches.forEach(match => {
      matches.push({ book, ...match, chapter: i + 1 })
    })
  })
  return matches
}

const searchChapter = (chapter, regex) => {
  let matches = []
  chapter.forEach((line, i) => {
    let match = regex.exec(line)
    if (match) {
      matches.push({ line: i + 1, match: match[0], text: match.input })
    }
  })
  return matches
}

const TOC = {
  'Torah': ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'],
  'Prophets': ['Amos', 'Jeremiah', 'Micah', 'Chronicles1', 'Joel', 'Nahum',
    'Chronicles2', 'Jonah', 'Obadiah', 'Ezekiel', 'Joshua', 'Samuel1',
    'Habakkuk', 'Judges', 'Samuel2', 'Haggai', 'Kings1', 'Zechariah',
    'Hosea', 'Kings2', 'Zephaniah', 'Isaiah', 'Malachi'],
  'Writings': ['Daniel', 'Job', 'Psalms', 'Ecclesiastes', 'Lamentations', 'Ruth',
    'Esther', 'Nehemiah', 'SongOfSongs', 'Ezra', 'Proverbs'],
  '': []
}



export { searchBook, TOC, loadJsonBook }
