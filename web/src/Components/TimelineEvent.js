import React, { Component } from 'react';
import {TimelineEvent} from 'react-event-timeline';

export default class extends Component {
  renderIcon = () => {
    if (this.props.photoURL) {
      return <img
                src={this.props.photoURL}
                alt={this.props.displayName}
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
      <TimelineEvent
        title={this.props.title}
        createdAt={this.props.time}
        icon={this.renderIcon()}
      >
        {this.props.body}
      </TimelineEvent>
    );
  }
}
