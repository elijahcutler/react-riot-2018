import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from "react-router-dom";
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
      <div>
        {this.state.user
          ?
          <div>
            <div className="media">
              <img
                className="mr-3"
                src={this.state.user.photoURL}
                alt="Profile Picture"
                style={{
                  width: '256px',
                  height: '256px',
                  borderRadius: '58px',
                }}
              />
            <div className="media-body">
              <h5 className="mt-0">{this.state.user.displayName}</h5>
              <div>
                <img
                  src='https://bit.ly/1CCy7nP'
                  alt="GitHub: "
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '32px',
                    float: 'left'
                  }}
                />
                <p>{this.state.user.username}</p>
              </div>
              <div>
                <img
                  src='https://bit.ly/2Muw7nP'
                  alt="Email: "
                  style={{
                    height: '24px',
                    float: 'left'
                  }}
                />
                <p>{this.state.user.email}</p>
              </div>
            </div>
          </div>
          </div>
          :
          <h1>Loading Profile</h1>
        }
      </div>
    );
  }
}

export default withRouter(Profile);
