import React, { Component } from 'react';
import axios from 'axios'
import { withRouter } from "react-router-dom";
import firebase from './firebase';
import githubicon from '../assets/GitHubMark.png';

class Login extends Component {
  authenticateWithGitHub = () => {
    var provider = new firebase.auth.GithubAuthProvider();
    provider.addScope('read:user');
    firebase.auth().signInWithPopup(provider).then(data => {
      this.setUsername(data.additionalUserInfo.username);
    }).catch(function(error) {
      var errorCode = error.code;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have signed up with a different provider for that email.');
      } else {
        console.error(error);
      }
    });
  };

  setUsername = username => {
    firebase.auth().currentUser.getIdToken(true).then(idToken => {
      axios({
        method: 'post',
        url: 'https://us-central1-gittogether-6f7ce.cloudfunctions.net/setUsername',
        data: {
          username
        },
        headers: {
          authorization: `Bearer ${idToken}`
        }
      }).then(res => {
        this.props.history.push('/');
      }).catch(error => {
        // TODO: Inform user of this error
        console.error(error);
      });
    });
  };

  render() {
    return (
      <div style={{
        backgroundColor: '#e2e2e2',
        display: 'flex',
        justifyContent:'center',
        alignItems:'center',
        height: 'calc(100vh - 56px)'
       }}>
         <div className="text-center">
          <img src={githubicon} alt="Login" />
          <br />
          <button
            className="btn btn-primary btn-raised"
            onClick={this.authenticateWithGitHub}
          >
            Login with GitHub
          </button>
          <br />
          <div style={{
            paddingTop: '20px'
           }}>
            <p>{"Don't have a GitHub account?"}</p>
            <p>
              {"You can create one "}<a href="https://github.com/join"
                target="_blank">here</a>.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
