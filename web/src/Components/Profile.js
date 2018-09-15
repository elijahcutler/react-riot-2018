import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase';

export default class extends Component {
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
          <h1>{this.state.user.displayName}</h1>
          :
          <h1>Loading Profile</h1>
        }
      </div>
    );
  }
}
