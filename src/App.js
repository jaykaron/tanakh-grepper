import React from 'react'
import './App.css'
import Search from './components/Search'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const theme = createMuiTheme({
  direction: 'rtl',
})

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ThemeProvider theme={theme}>
          <Search />
        </ThemeProvider>
      </header>
    </div>
  );
}

export default App;
