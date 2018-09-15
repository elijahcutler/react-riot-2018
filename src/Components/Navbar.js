import React, { Component } from 'react';
import {
  Link,
  withRouter
} from "react-router-dom";
import firebase from 'firebase';

class Navbar extends Component {
  state = {
    authenticated: false
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true
        });
        this.props.history.push("/");
      } else {
        this.setState({
          authenticated: false
        });
      }
    });
  }

  logout = () => {
    firebase.auth().signOut().then(() => {
      this.props.history.push("/");
    }).catch(error => {
      console.error(error);
    });
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand">GitTogether</a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
              >
                Home
              </Link>
            </li>
          </ul>
          <div className="my-2 my-lg-0">
            <ul className="navbar-nav mr-auto">
              {this.state.authenticated === true
                ?
                <li className="nav-item active">
                  <button
                    className="btn btn-danger"
                    onClick={this.logout}
                  >
                    Logout
                  </button>
                </li>
                :
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
              }
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);