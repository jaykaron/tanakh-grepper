import React, { useState } from 'react'
import { TextField, Button, MenuItem } from '@material-ui/core'

import { searchBook, TOC } from '../search'



const Search = () => {
  const [section, setSection] = useState('')
  const [book, setBook] = useState('')
  const [regex, setRegex] = useState('')

  const clickHandler = ev => {
    console.log(regex)
    if (section === '' || book === '') {
      return
    }
    searchBook(section, book, regex)
      .then(console.log)
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
    <div>
      <TextField select value={section} onChange={onSectionChange}>
        {Object.keys(TOC).map((title, i) => (<MenuItem key={i} value={title}>{title}</MenuItem>))}
      </TextField>
      <TextField select value={book} onChange={onBookChange}>
        {TOC[section].map((title, i) => (<MenuItem key={i} value={title}>{title}</MenuItem>))}
      </TextField>
      <TextField value={regex} onChange={onTextChange} />
      <Button variant='contained' color='primary' onClick={clickHandler}>Submit</Button>
    </div>
  )
}

export default Search