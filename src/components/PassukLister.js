import React, { useState } from 'react'
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  TablePagination,
  Paper
} from '@material-ui/core'

import { getText } from '../translation'

const rowsPerPage = 30

const PassukLister = ({ passukim, lang }) => {
  const [page, setPage] = useState(0)

  const en = lang === 'en'
  const tableStyle = {
    direction: en ? 'ltr' : 'rtl',
    maxHeight: '60vh',
    width: '100%',
    maxWidth: '60rem'
  }

  if (passukim.length === 0) {
    return null
  }

  return (
    <div >
      <TablePagination
        component="div"
        count={passukim.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={(event, newPage) => setPage(newPage)}
        rowsPerPageOptions={[rowsPerPage]}
      />
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
            {passukim
              .slice(rowsPerPage * page, rowsPerPage * (page + 1))
              .map(({ book, chapter, line, matches, text }, i) => (
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
    </div>
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