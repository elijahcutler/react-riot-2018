import React, { Component } from 'react';
import {TimelineEvent, TimelineBlip} from 'react-event-timeline';

export default class extends Component {
  renderIcon = () => {
    if (this.props.photoURL) {
      return <img
                src={this.props.photoURL}
                alt={this.props.username}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '16px',
                  marginLeft: '-2.5px'
                }}
              />;
    } else {
      return <div />;
    }
  }

  render() {
    return (
      <div>
        {this.props.body
          ?
            <TimelineEvent
              title={`${this.props.username} ${this.props.title}`}
              createdAt={this.props.time}
              icon={this.renderIcon()}
            >
              <div>
                {this.props.body}
              </div>
            </TimelineEvent>
          :
            <TimelineBlip
              title={`${this.props.username} ${this.props.title}`}
              icon={this.renderIcon()}
            />
        }
      </div>
    );
  }
}
