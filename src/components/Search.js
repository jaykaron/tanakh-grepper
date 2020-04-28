import React, { useState } from 'react'
import { TextField, Button, MenuItem } from '@material-ui/core'

import { searchBook, TOC } from '../search'
import { getText } from '../translation'


const Search = ({ setResults, lang }) => {
  const [section, setSection] = useState('')
  const [book, setBook] = useState('')
  const [regex, setRegex] = useState('')

  const clickHandler = ev => {
    if (section === '' || book === '') {
      return
    }
    searchBook(section, book, regex)
      .then(results => {
        setResults(results)
      })
  }

  const onSectionChange = ev => {
    setSection(ev.target.value)
    setBook('')
  }
  const onBookChange = ev => {
    setBook(ev.target.value)
  }
  const onTextChange = ev => {
    setRegex(ev.target.value)
  }

  return (
    <div style={{ direction: lang === 'en' ? 'ltr' : 'rtl' }} >
      <TextField select value={section} label={getText('Section', lang)} onChange={onSectionChange}>
        {Object.keys(TOC).map((title, i) => (<MenuItem key={i} value={title}>{getText(title, lang)}</MenuItem>))}
      </TextField>
      <TextField select value={book} label={getText('Book', lang)} onChange={onBookChange}>
        {TOC[section].map((title, i) => (<MenuItem key={i} value={title}>{getText(title, lang)}</MenuItem>))}
      </TextField>
      <TextField value={regex} onChange={onTextChange} />
      <Button variant='contained' color='primary' onClick={clickHandler}>{getText('Search', lang)}</Button>
    </div >
  )
}

export default Search