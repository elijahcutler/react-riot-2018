import React, { Component } from 'react';
import axios from 'axios';
import {
  Link,
  withRouter,
  Route
} from 'react-router-dom';
import firebase from './firebase';

class Profile extends Component {
  state = {
    canFollow: !!firebase.auth().currentUser,
    isFollowing: false,
    following: [],
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
    }
    if (firebase.auth().currentUser) {
      if (firebase.auth().currentUser.uid === uid) {
        this.setState({
          canFollow: false
        });
      }
    }
    axios.get(`https://us-central1-gittogether-6f7ce.cloudfunctions.net/getProfile?uid=${uid}`).then(res => {
      this.setState({
        user: res.data
      });
      this.loadFollowing(this.state.user.uid);
    }).catch(error => {
      this.setState({ error });
    });
  }

  loadFollowing = uid => {
    axios.get(`https://us-central1-gittogether-6f7ce.cloudfunctions.net/getFollowers?uid=${uid}`).then(res => {
      console.log(res.data);
      this.setState({
        following: res.data
      });
    }).catch(error => {
      this.setState({ error });
    });
  }

  renderFollowers = () => {
    return <div>
      {this.state.following.map(user => {
        return <div
          key={user.uid}
          className="row"
        >
          <div className="col-2 mt-3">
            <img
              src={user.photoURL}
              alt="Profile Picture"
              style={{
                width: '100%',
                borderRadius: '58px',
              }}
            />
          </div>
          <div className="m-3">
            <h3>
              <Link
                className="text-link"
                to={`/profile/${user.uid}`}
              >
                {user.displayName || `@${user.username}`}
              </Link>
            </h3>
            {user.displayName &&
              <p>@{user.username}</p>
            }
          </div>
        </div>;
      })}
    </div>;
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
            <div
              className="col mt-3"
              style={{
                height: 'calc(100vh - 73px)',
                overflowY: 'scroll'
              }}
            >
              <div>
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to={`/profile/${this.state.user.uid}/following`}
                    >
                      Following
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to={`/profile/${this.state.user.uid}/groups`}
                    >
                      Groups
                    </Link>
                  </li>
                </ul>
                {this.props.location.pathname.endsWith('groups')
                  ? <h1>Groups</h1>
                  : this.renderFollowers()
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
