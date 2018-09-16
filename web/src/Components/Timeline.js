import React, { Component } from 'react';
import {Timeline} from 'react-event-timeline'
import TimelineEvent from './TimelineEvent';

export default class extends Component {
  render() {
    let events = this.props.events;

    return (
      <div>
        {events.length
          ?
            <Timeline>
              {events.map(event => {
                return (
                  <TimelineEvent
                    title={event.title}
                    body={event.body}
                    date={event.time}
                    displayName={event.displayName}
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
                    <h2>Nothings happened yet?!</h2>
                    <p>Be the first to <a href="#">make a post</a>!</p>
                  </div>
                :
                  <div className="mx-auto text-center mt-2">
                    <h2>Uh oh!</h2>
                    <p>Your timeline is empty. Check out the <a href="#">global timeline</a> or start following others to get some posts!</p>
                  </div>
              }
            </div>
        }
      </div>
    );
  }
}
