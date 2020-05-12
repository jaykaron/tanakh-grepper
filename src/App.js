import React, { useState } from 'react'
import { Button, IconButton, SvgIcon, makeStyles } from '@material-ui/core'
import Search from './components/Search'
import PassukLister from './components/PassukLister'
import Welcome from './components/Welcome'
import GithubCorner from './components/GithubCorner'

const useStyles = makeStyles(() => ({
  main: {
    textAlign: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '90%',
    margin: 'auto'
  },
  bottomButtons: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    '& > button': {
      marginRight: '1rem'
    }
  }
}))

function App() {
  const [results, setResults] = useState([])
  const [lang, setLang] = useState('en')
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const classes = useStyles()

  return (
    <div>
      <GithubCorner />
      <div className={classes.main}>
        <Welcome open={welcomeOpen} onClose={() => setWelcomeOpen(false)} />
        <Search setResults={setResults} lang={lang} />
        <PassukLister lang={lang} passukim={results} />
        <div className={classes.bottomButtons}>
          <IconButton onClick={() => setWelcomeOpen(true)}>
            <SvgIcon>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </SvgIcon>
          </IconButton>
          <Button variant='contained' size='small'
            onClick={() => {
              setLang(lang === 'en' ? 'he' : 'en')
            }}>
            {lang === 'en' ? 'עברית' : 'English'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App;
