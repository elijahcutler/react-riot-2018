import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import firebase from './firebase';

class Login extends Component {
  authenticateWithGitHub = () => {
    var provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('read:user');
    firebase.auth().signInWithPopup(provider).then(() => {
      this.props.history.push('/');
    }).catch(function(error) {
      var errorCode = error.code;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have signed up with a different provider for that email.');
      } else {
        console.error(error);
      }
    });
  };

  render() {
    return (
      <div>
        <h1>Login</h1>
        <button
          className="btn btn-primary btn-raised"
          onClick={this.authenticateWithGitHub}
        >
          Login
        </button>
      </div>
    );
  }
}

export default withRouter(Login);
