import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch
} from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Login from './Components/Login';
import {PublicRoute, PrivateRoute} from './Components/Routes';

class App extends Component {
  state = {};

  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Switch>
            <PublicRoute
                exact
                path="/"
                component={props => <Home />}
            />
            <PublicRoute
                exact
                path="/login"
                component={props => <Login />}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
