import React, { Component } from 'react';
import {
  Link,
  withRouter
} from "react-router-dom";
import firebase from 'firebase';
import logo from '../assets/GitTogetherLogo.png';
import logoText from '../assets/GitTogetherLogoText.png';

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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a href="/" className="navbar-brand">
          <img src={logoText} width="104" height="30" alt="" />
        </a>
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
                  to="/activity"
                >
                  Activity
                </Link>
              </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/calendar"
                    >
                      Calendar
                    </Link>
                  </li>
          </ul>
          <div className="my-2 my-lg-0">
              {this.state.authenticated === true
                ?
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/profile"
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link text-danger"
                      onClick={this.logout}
                    >
                      Logout
                    </a>
                  </li>
                </ul>
                :
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/login"
                    >
                      Login
                    </Link>
                  </li>
                </ul>
              }
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);
