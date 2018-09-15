import React, { Component } from 'react';
import firebase from './firebase';

export default class extends Component {

  authenticateWithGitHub = () => {
    var provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('user');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
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
