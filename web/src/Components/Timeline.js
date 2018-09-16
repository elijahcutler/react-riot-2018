import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Timeline} from 'react-event-timeline';
import TimelineEvent from './TimelineEvent';

export default class extends Component {
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
                    title={event.title}
                    body={event.body}
                    time={event.time}
                    uid={event.uid}
                    username={event.username}
                    photoURL={event.photoURL}
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
