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
          {passukim.map(({ book, chapter, line, matches, text }, i) => (
            <TableRow key={i}>
              <TableCell align={en ? 'left' : 'right'}>
                {getText(book, lang)}
              </TableCell>
              <TableCell align="left">{chapter}:{line}</TableCell>
              <TableCell align="right">{boldMatch(text, matches)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}


function boldMatch(text, matches) {
  let result = ''
  let trailingIndex = 0
  for (let i = 0; i < matches.length; i++) {
    const index = matches[i].index
    const len = matches[i].match.length

    result += text.slice(trailingIndex, index)
    result += '<b>'
    result += text.slice(index, index + len)
    result += '</b>'
    trailingIndex = index + len
  }
  result += text.slice(trailingIndex)

  return (
    <span dangerouslySetInnerHTML={{ __html: result }} />
  )
}

export default PassukLister