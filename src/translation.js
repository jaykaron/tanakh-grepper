const BOOK_NAMES = {
  Genesis: "בראשית",
  Exodus: "שמות",
  Leviticus: "ויקרא",
  Numbers: "במדבר",
  Deuteronomy: "דברים",
  Joshua: "יהושע",
  Judges: "שופטים",
  Samuel1: "שמואל א",
  Samuel2: "שמואל ב",
  Kings1: "מלכים א",
  Kings2: "מלכים ב",
  Isaiah: "ישעיהו",
  Jeremiah: "ירמיהו",
  Ezekiel: "יחזקאל",
  Hosea: "הושע",
  Joel: "יואל",
  Amos: "עמוס",
  Obadiah: "עובדיה",
  Jonah: "יונה",
  Micah: "מיכה",
  Nahum: "נחום",
  Habakuk: "חבקוק",
  Zephaniah: "צפניה",
  Haggai: "חגי",
  Zechariah: "זכריה",
  Malachi: "מלאכי",
  Psalms: "תהלים",
  Proverbs: "משלי",
  Job: "איוב",
  SongOfSongs: "שיר השירים",
  Ruth: "רות",
  Lamentations: "איכה",
  Ecclesiastes: "קהלת",
  Esther: "אסתר",
  Daniel: "דניאל",
  Ezra: "עזרא",
  Nehemiah: "נחמיה",
  Chronicles1: "דברי הימים א",
  Chronicles2: "דברי הימים ב",
};

const SECTIONS = {
  Torah: "תורה",
  Prophets: "נביאים",
  Writings: "כתובים",
};

const MISC = {
  of: "מתוך",
  "more than": "יותר מ",
};
const HEBREW = {
  Section: "חלק",
  Book: "ספר",
  Chapter: "פרק",
  Verse: "פסוק",
  Text: "כתוב",
  Search: "חיפוש",
  All: "הכל",
  ...SECTIONS,
  ...BOOK_NAMES,
  ...MISC,
};

const getText = (text, lang) => {
  if (lang === "en") {
    return text;
  }
  return HEBREW[text] || text;
};

export { getText };
