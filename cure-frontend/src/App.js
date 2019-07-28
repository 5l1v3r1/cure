import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import DebugComponent from './components/debug';
import NavbarComponent from './components/navbar';
import './App.css';
import { blue, lightBlue } from '@material-ui/core/colors';
import LoginComponent from './components/auth/login';
import DashboardComponent from './components/dashboard/dashboard';
import LogoutComponent from './components/auth/logout';
import RegisterComponent from './components/auth/register';
import TrackerDiscoveryComponent from './components/tracker/tracker-discovery';
import TrackerOverviewComponent from './components/tracker/tracker-overview';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: lightBlue
  },
  typography: {
    useNextVariants: true
  }
})

class App extends Component {
  render() {
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          
          <BrowserRouter>
            <div>
              <NavbarComponent />
              <Switch>
                <Route path="/login" component={LoginComponent} />
                <Route path="/debug" component={DebugComponent} />
                <Route path="/dashboard" exact component={DashboardComponent} />
                <Route path="/logout" component={LogoutComponent} />
                <Route path="/register" component={RegisterComponent} />
                <Route path="/tracker-discovery" component={TrackerDiscoveryComponent} />
                <Route path="/trackers/:trackerId" component={TrackerOverviewComponent} />
              </Switch>
            </div>
          </BrowserRouter>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
