import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import logo from './logo.svg';
import firebase from './Components/firebase';

class App extends Component {
  state = {};

  render() {
    return (
      <Router>
        <div>
          <Switch>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
