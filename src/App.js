import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import logo from './logo.svg';
import firebase from './Components/firebase';
import Home from './Components/Home';
import {PublicRoute, PrivateRoute} from './Components/Routes';

class App extends Component {
  state = {};

  render() {
    return (
      <Router>
        <div>
          <Switch>
          <PublicRoute
              exact
              path="/"
              component={props => <Home />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
