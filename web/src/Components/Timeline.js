import React, { Component } from 'react';
import firebase from 'firebase';
import {Link} from 'react-router-dom';
import {Timeline} from 'react-event-timeline';
import TimelineEvent from './TimelineEvent';

export default class extends Component {
  state = {
    authenticated: false,
    idToken: null,
    uid: null
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          uid: user.uid
        });
        firebase.auth().currentUser.getIdToken().then(idToken => {
          this.setState({
            authenticated: true,
            idToken
          });
        }).catch(error => {
          console.error('Unable to properly authenticate user:', error);
          this.setState({
            authenticated: false,
            uid: null
          });
        });
      } else {
        this.setState({
          authenticated: false,
          uid: null
        });
      }
    });
  }

  render() {
    let events = this.props.events;

    return (
      <div style={this.props.style}>
        {events.length
          ?
            <Timeline>
              {events.map(event => {
                return (
                  <TimelineEvent
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    body={event.body}
                    time={event.time}
                    uid={event.uid}
                    likes={event.likes}
                    dislikes={event.dislikes}
                    reports={event.reports}
                    username={event.username}
                    photoURL={event.photoURL}
                    authenticated={this.state.authenticated}
                    idToken={this.state.idToken}
                    isMine={this.state.uid === event.uid}
                  />
                )
              })}
            </Timeline>
          :
            <div>
              {this.props.global
                ?
                  <div className="mx-auto text-center mt-2">
                    <h2>Nothing has happened yet?!</h2>
                    <p>Be the first to <a href="#">make a post</a>!</p>
                  </div>
                :
                  <div className="mx-auto text-center mt-2">
                    <h2>Uh oh!</h2>
                    <p>Your timeline is empty. Check out the <Link
                      className="text-primary"
                      to="/events"
                    >
                      global timeline
                    </Link> or start following others to get some posts!</p>
                  </div>
              }
            </div>
        }
      </div>
    );
  }
}
