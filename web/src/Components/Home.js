import React, { Component } from 'react';
import firebase from './firebase';
import {
  Link,
  withRouter
} from "react-router-dom";
import {Timeline} from 'react-event-timeline'
import TimelineEvent from './TimelineEvent';

export default class extends Component {

  state = {
    authenticated: false
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true
        });
      } else {
        this.setState({
          authenticated: false
        });
      }
    });
  }

  render() {
    return (
      <div>
      {this.state.authenticated === true
         ?
         <Timeline>
          <TimelineEvent
            title='Testing'
            body='Testing'
            date={new Date().getTime()}
            userName='Testing'
            profileImageURL='http://4.bp.blogspot.com/_Mk4QNmA2vYQ/TF_rSmYQC0I/AAAAAAAAAnU/DP6appPWOrQ/s1600/patata.jpg'
          />
         </Timeline>
         :
         <h1>You need to login to see the home page...</h1>
       }
      </div>
    );
  }
}
