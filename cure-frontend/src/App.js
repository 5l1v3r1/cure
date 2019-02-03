import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Route, BrowserRouter} from 'react-router-dom';
import MainComponent from './components/main';
import DebugComponent from './components/debug';
import NavbarComponent from './components/navbar';
import './App.css';
import { blue, lightBlue } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: lightBlue
  }
})

class App extends Component {
  render() {
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <NavbarComponent />
          <BrowserRouter>
            <div>
              <Route path="/" exact component={MainComponent} />
              <Route path="/debug" component={DebugComponent} />
            </div>
          </BrowserRouter>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
