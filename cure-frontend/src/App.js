import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Route, BrowserRouter, Link } from 'react-router-dom';
import MainComponent from './components/main';
import DebugComponent from './components/debug';
import NavbarComponent from './components/navbar';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavbarComponent />
        <BrowserRouter>
          <div>
            <Route path="/" exact component={MainComponent} />
            <Route path="/debug" component={DebugComponent} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
