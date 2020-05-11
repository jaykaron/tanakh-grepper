import React from 'react'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@material-ui/core'

import { getText } from '../translation'


const PassukLister = ({ passukim, lang }) => {
  const en = lang === 'en'
  const tableStyle = {
    direction: en ? 'ltr' : 'rtl',
    maxHeight: '60vh'
  }

  if (passukim.length === 0) {
    return null
  }

  return (
    <TableContainer component={Paper} style={tableStyle}>
      <Table stickyHeader aria-label="results table" size='small' >
        <TableHead>
          <TableRow>
            <TableCell align={en ? 'left' : 'right'}>{getText('Book', lang)}</TableCell>
            <TableCell align="center">{getText('Verse', lang)}</TableCell>
            <TableCell align="center">{getText('Text', lang)}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {passukim.map(({ book, chapter, line, match, index, text }, i) => (
            <TableRow key={i}>
              <TableCell align={en ? 'left' : 'right'}>
                {getText(book, lang)}
              </TableCell>
              <TableCell align="left">{chapter}:{line}</TableCell>
              <TableCell align="right">{boldMatch(text, match, index)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}


function boldMatch(text, match, index) {
  return (
    <span>
      {text.slice(0, index)}
      <b>
        {text.slice(index, index + match.length)}
      </b>
      {text.slice(index + match.length)}
    </span>
  )
}

export default PassukLister