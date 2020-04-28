import React, { useState } from 'react'
// import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import './App.css'
import Search from './components/Search'
import PassukLister from './components/PassukLister'

// const theme = createMuiTheme({
//   direction: 'rtl',
// })

function App() {
  const [results, setResults] = useState([])
  const [lang, setLang] = useState('en')
  return (
    <div className="App">
      <header className="App-header">
        {/* <ThemeProvider theme={theme}> */}
        <Search setResults={setResults} lang={lang} />
        <PassukLister lang={lang} passukim={results} />
        <Button variant='contained' onClick={() => {
          setLang(lang === 'en' ? 'he' : 'en')
        }}>
          Toggle Lang
        </Button>
        {/* </ThemeProvider> */}
      </header>
    </div>
  );
}

export default App;
