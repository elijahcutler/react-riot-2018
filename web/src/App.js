import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Redirect
} from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Login from './Components/Login';
import Profile from './Components/Profile';
import Events from './Components/Events';
import Calendar from './Components/MLHCalendar';
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
                path="/login"
                component={props => <Login />}
            />
            <PrivateRoute
                exact
                path="/profile"
                component={props => <Profile />}
            />
            <PrivateRoute
                exact
                path="/profile/following"
                component={props => <Profile />}
            />
            <PrivateRoute
                exact
                path="/profile/groups"
                component={props => <Profile />}
            />
            <PublicRoute
                exact
                path="/profile/:uid"
                component={props => <Redirect to={`/profile/${props.location.pathname.substring(props.location.pathname.lastIndexOf('/') + 1)}/following`} />}
            />
            <PublicRoute
                exact
                path="/profile/:uid/following"
                component={props => <Profile />}
            />
            <PublicRoute
                exact
                path="/profile/:uid/groups"
                component={props => <Profile />}
            />
            <PublicRoute
                exact
                path="/activity"
                component={props => <Events />}
            />
            <PublicRoute
                exact
                path="/calendar"
                component={props => <Calendar />}
            />
            <PublicRoute
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
