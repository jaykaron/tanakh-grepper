import React, { useState } from 'react'
import { makeStyles, Paper, TextField, Button } from '@material-ui/core'

import Select from './Select'
import { search, bookTitles, sectionTitles, numChapters } from '../textContent'
import { getText } from '../translation'

const useStyles = makeStyles({
  root: {
    direction: props => props.lang === 'en' ? 'ltr' : 'rtl',
    padding: '1rem',
    paddingBottom: '1.5rem',
    marginBottom: '2rem'
  },
  inner: {
    marginLeft: '0.5rem',
    marginRight: '0.5rem'
  },
});


const Search = ({ setResults, lang }) => {
  const [section, setSection] = useState('')
  const [book, setBook] = useState('')
  const [chapter, setChapter] = useState('')
  const [chapters, setChapters] = useState('')
  const [regex, setRegex] = useState('ראש')

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

  return (
    <Paper elevation={3} className={classes.root} >
      <Select label='Section' options={sectionTitles()} reliesOn='None'
        lang={lang} className={classes.inner} style={{ minWidth: '8ch' }}
        value={section} onValueChange={onSectionChange}
      />
      <Select label='Book' options={bookTitles(section)} reliesOn={section}
        lang={lang} className={classes.inner} style={{ minWidth: '8ch' }}
        value={book} onValueChange={onBookChange}
      />
      <Select label='Chapter' options={chapters}
        reliesOn={book} value={chapter} onValueChange={onChapterChange}
        lang={lang} className={classes.inner} style={{ minWidth: '8ch' }}
      />
      <TextField value={regex} onChange={onTextChange}
        className={classes.inner} style={{ verticalAlign: 'bottom' }}
      />
      <Button variant='contained' color='primary' className={classes.inner}
        onClick={clickHandler} style={{ verticalAlign: 'bottom' }}
      >
        {getText('Search', lang)}
      </Button>
    </Paper >
  )
}

export default Search