import React, { Component } from 'react';
import axios from 'axios';
import {withRouter} from "react-router-dom";
import firebase from './firebase';

class Profile extends Component {
  state = {
    canFollow: !!firebase.auth().currentUser,
    isFollowing: false,
    user: null
  }

  componentDidMount() {
    this.loadProfileToView();
  }

  loadProfileToView = () => {
    let uid = this.props.match.params.uid;
    if (!uid) {
      let user = firebase.auth().currentUser;
      if (user) uid = user.uid;
      if (user.uid === uid) {
        this.setState({
          canFollow: false
        });
      }
    }
    axios.get(`https://us-central1-gittogether-6f7ce.cloudfunctions.net/getProfile?uid=${uid}`).then(res => {
      this.setState({
        user: res.data
      });
    }).catch(error => {
      this.setState({ error });
    });
  }

  follow = () => {
    firebase.auth().currentUser.getIdToken(true).then(idToken => {
      axios({
        method: 'post',
        url: 'https://us-central1-gittogether-6f7ce.cloudfunctions.net/followUser',
        data: {
          uid: this.state.user.uid,
          following: true
        },
        headers: {
          authorization: `Bearer ${idToken}`
        }
      }).then(res => {
        console.log(res);
      }).catch(error => {
        // TODO: Inform user of this error
        console.error(error);
      });
    });
  }

  unfollow = () => {

  }

  render() {
    return (
      <div className="container">
        {this.state.user
          ?
          <div className="row">
            <div className="col-4 mt-3">
              <img
                src={this.state.user.photoURL}
                alt="Profile Picture"
                style={{
                  width: '100%',
                  borderRadius: '58px',
                }}
              />
              <div className="m-2">
                <h3>
                  <a href={`https://github.com/${this.state.user.username}`}>
                    {this.state.user.displayName || `@${this.state.user.username}`}
                  </a>
                </h3>
                {this.state.user.displayName &&
                  <p>@{this.state.user.username}</p>
                }
                {this.state.canFollow &&
                  <button
                    className="btn btn-primary btn-raised btn-block"
                    onClick={this.follow}
                  >
                    Follow
                  </button>
                }
              </div>
            </div>
          </div>
          : <h1>Loading Profile</h1>
        }
      </div>
    );
  }
}

export default withRouter(Profile);
