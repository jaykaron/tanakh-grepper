import React, { useState } from 'react'
import { makeStyles, Paper, TextField, Button } from '@material-ui/core'

import Select from './Select'
import { search, bookTitles, sectionTitles, numChapters } from '../textContent'
import { getText } from '../translation'
import { DEBUG } from '../constants'

const useStyles = makeStyles({
  root: {
    direction: props => props.lang === 'en' ? 'ltr' : 'rtl',
    zIndex: 1,
    marginTop: '1rem',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    paddingBottom: '1.5rem',
    '& > *': {
      marginLeft: '0.5rem',
      marginRight: '0.5rem',
      marginTop: '1rem'
    }
  },
});

const Search = ({ setResults, lang }) => {
  const [section, setSection] = useState(!DEBUG ? '' : 'Torah')
  const [book, setBook] = useState(!DEBUG ? '' : 'Genesis')
  const [chapter, setChapter] = useState(!DEBUG ? '' : 1)
  const [chapters, setChapters] = useState(!DEBUG ? '' : [1])
  const [regex, setRegex] = useState(!DEBUG ? '' : '\\w')

  const classes = useStyles({ lang })

  const clickHandler = ev => {
    search(section, book, chapter, regex)
      .then(results => {
        console.log(results)
        setResults(results)
      })
  }

  const onSectionChange = ev => {
    setSection(ev.target.value)
    setBook('')
    setChapter('')
  }
  const onBookChange = ev => {
    setBook(ev.target.value)
    setChapter('')
    numChapters(section, ev.target.value)
      .then(n => {
        setChapters([...Array(n).keys()].map(i => i + 1))
      })
  }
  const onChapterChange = ev => {
    setChapter(ev.target.value)
  }
  const onTextChange = ev => {
    setRegex(ev.target.value)
  }
  const onTextKeyDown = ev => {
    if (ev.key === 'Enter') {
      clickHandler()
    }
  }

  return (
    <Paper elevation={3} className={classes.root} >
      <Select label='Section' options={sectionTitles()} reliesOn='None'
        lang={lang} style={{ minWidth: '8ch' }}
        value={section} onValueChange={onSectionChange}
      />
      <Select label='Book' options={bookTitles(section)} reliesOn={section}
        lang={lang} style={{ minWidth: '8ch' }}
        value={book} onValueChange={onBookChange}
      />
      <Select label='Chapter' options={chapters}
        reliesOn={book} value={chapter} onValueChange={onChapterChange}
        lang={lang} style={{ minWidth: '8ch' }}
      />
      <TextField value={regex} onChange={onTextChange}
        onKeyDown={onTextKeyDown}
        style={{ verticalAlign: 'bottom' }}
      />
      <Button variant='contained' color='primary'
        onClick={clickHandler} style={{ verticalAlign: 'bottom' }}
      >
        {getText('Search', lang)}
      </Button>
    </Paper >
  )
}

export default Search