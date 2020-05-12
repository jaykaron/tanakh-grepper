import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import Search from './components/Search'
import PassukLister from './components/PassukLister'
import Welcome from './components/Welcome'

const style = {
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
  langButton: {
    position: 'absolute',
    bottom: 20,
    left: 30
  }
}

function App() {
  const [results, setResults] = useState([])
  const [lang, setLang] = useState('en')
  const [welcomeOpen, setWelcomeOpen] = useState(true)

  return (
    <div style={style.main}>
      <Welcome open={welcomeOpen} onClose={() => setWelcomeOpen(false)} />
      <Search setResults={setResults} lang={lang} />
      <PassukLister lang={lang} passukim={results} />
      <Button variant='contained' style={style.langButton}
        size='small'
        onClick={() => {
          setLang(lang === 'en' ? 'he' : 'en')
        }}>
        {lang === 'en' ? 'עברית' : 'English'}
      </Button>
    </div >
  );
}

export default App;
