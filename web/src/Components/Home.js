import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';

export default class extends Component {
  state = {
    authenticated: false,
    idToken: null,
    error: null,
    events: []
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.auth().currentUser.getIdToken(true).then(idToken => {
          this.setState({
            authenticated: true,
            idToken
          });
          this.fetchTimeline();
        }).catch(error => {
          console.error('Unable to properly authenticate user:', error);
          this.setState({
            authenticated: true,
            error
          });
        });
      } else {
        this.setState({
          authenticated: false
        });
      }
    });
  }

  fetchTimeline = (page = 0) => {
    axios.get('http://localhost:5000/gittogether-6f7ce/us-central1/getTimeline', {
      headers: {
        authorization: `Bearer ${this.state.idToken}`
      }
    }).then(res => {
      console.log(res);
    }).catch(error => {
      this.setState({ error });
    });
  }

  render() {
    return (
      <div>
        {this.state.authenticated
          ?
          <div>
            {this.state.authenticated === true
              ?
                <div className="container">
                  <Timeline events={this.state.events} global={false} />
                </div>
              : <h1>You need to login to see the home page...</h1>
            }
          </div>
          : <div />
        }
      </div>
    );
  }
}
