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
    canFollow: false,
    isFollowing: false,
    following: [],
    user: null,
    idToken: null
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.auth().currentUser.getIdToken(true).then(idToken => {
          this.setState({
            idToken
          });
          this.loadProfileToView(user);
        }).catch(error => {
          console.error('Unable to properly authenticate user:', error);
          this.loadProfileToView(null);
        });
      } else {
        this.setState({
          idToken: null
        });
        this.loadProfileToView(null);
      }
    });
  }

  loadProfileToView = user => {
    let uid = this.props.match.params.uid;
    if (!uid && user) uid = user.uid;
    if (user.uid !== uid) this.amIFollowing(uid);
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
      this.setState({
        following: res.data
      });
    }).catch(error => {
      this.setState({ error });
    });
  }

  amIFollowing = uid => {
    axios.get(`https://us-central1-gittogether-6f7ce.cloudfunctions.net/amIFollowing?uid=${uid}`, {
      headers: {
        authorization: `Bearer ${this.state.idToken}`
      }
    }).then(res => {
      this.setState({
        canFollow: true,
        isFollowing: res.data
      });
    }).catch(error => {
      console.error(error);
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
    axios({
      method: 'post',
      url: 'https://us-central1-gittogether-6f7ce.cloudfunctions.net/followUser',
      data: {
        uid: this.state.user.uid,
        following: true
      },
      headers: {
        authorization: `Bearer ${this.state.idToken}`
      }
    }).then(res => {
      this.setState({
        isFollowing: true
      });
    }).catch(error => {
      // TODO: Inform user of this error
      console.error(error);
    });
  }

  unfollow = () => {
    axios({
      method: 'post',
      url: 'https://us-central1-gittogether-6f7ce.cloudfunctions.net/followUser',
      data: {
        uid: this.state.user.uid,
        following: false
      },
      headers: {
        authorization: `Bearer ${this.state.idToken}`
      }
    }).then(res => {
      this.setState({
        isFollowing: false
      });
    }).catch(error => {
      // TODO: Inform user of this error
      console.error(error);
    });
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
                  <div>
                    {this.state.isFollowing
                      ?
                        <button
                          className="btn btn-secondary btn-raised btn-block"
                          onClick={this.unfollow}
                        >
                          Unfollow
                        </button>
                      :
                        <button
                          className="btn btn-primary btn-raised btn-block"
                          onClick={this.follow}
                        >
                          Follow
                        </button>
                    }
                    </div>
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
