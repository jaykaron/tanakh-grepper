
const loadBook = (section, book) => new Promise((resolve, reject) => {
  fetch(require(`./texts/${section}/${book}.txt`))
    .then(resp => resolve(resp.text()))
    .catch(reject)
})


const searchBook = async (section, book, regexStr) => {
  let text = await loadBook(section, book)
  let rgx = new RegExp(regexStr, 'g')
  let matches = text.match(rgx)
  return matches
}

const TOC = {
  'Torah': ['Deuteronomy', 'Exodus', 'Genesis', 'Leviticus', 'Numbers'],
  'Prophets': ['Amos', 'Jeremiah', 'Micah', 'Chronicles1', 'Joel', 'Nahum',
    'Chronicles2', 'Jonah', 'Obadiah', 'Ezekiel', 'Joshua', 'Samuel1',
    'Habakkuk', 'Judges', 'Samuel2', 'Haggai', 'Kings1', 'Zechariah',
    'Hosea', 'Kings2', 'Zephaniah', 'Isaiah', 'Malachi'],
  'Writings': ['Daniel', 'Job', 'Psalms', 'Ecclesiastes', 'Lamentations', 'Ruth',
    'Esther', 'Nehemiah', 'SongOfSongs', 'Ezra', 'Proverbs'],
  '': []
}



export { searchBook, TOC }


