import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogContentText as DialogText
} from '@material-ui/core'

const WIKI_URL = 'https://en.wikipedia.org/wiki/Regular_expression'
const BLOG_URL = 'https://codular.com/regex'

const TRIPLE_REGEX = /(\w)\1\1/.toString().slice(1, -1)
const ALLIT_REGEX = /(^| )(\w)\w+( \2\w+){4,}/.toString().slice(1, -1)

const Welcome = ({ open, onClose }) => {
  return (
    <Dialog maxWidth='md' fullWidth
      open={open} onClose={onClose}
      aria-labelledby="welcome-dialog-title">
      <DialogContent>
        <DialogText variant='h3'>
          Welcome to a new way to search Tanakh!
        </DialogText>
        <DialogText>
          Welcome to the site made for people (aka. me) who were just not
          satisfied with the current options to search through Tanakh (and
          who have working experience with regular expressions).
          </DialogText>
        <DialogText>
          Like what if you want to find all the times a letter appears 3 times in
            a row within one word? Simple <code>{TRIPLE_REGEX}</code> and bam.
          </DialogText>
        <DialogText>
          The passuk אמר אויב ארדף אשיג אחלק שלל is famous for its alliteration
          but what if there are more alliterative passukim? How would you find them?
            <small> There are. Try out <code>{ALLIT_REGEX}</code></small>
        </DialogText>
        <DialogText>
          If you aren't familiar with regular expressions they are a powerful way
          of finding patterns in text. You can read up about them
            on <a href={WIKI_URL}>Wikipedia</a> or this <a href={BLOG_URL}>random blog post</a>.
        </DialogText>
      </DialogContent>
    </Dialog >
  )
}

export default Welcome