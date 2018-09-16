import React, { Component } from 'react';
import axios from 'axios';
import {withRouter} from "react-router-dom";
import firebase from './firebase';

class Profile extends Component {
  state = {
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
    axios.get(`https://us-central1-gittogether-6f7ce.cloudfunctions.net/getProfile?uid=${uid}`).then(res => {
      this.setState({
        user: res.data
      });
    }).catch(error => {
      this.setState({ error });
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
