import React, { Component } from 'react';
import {TimelineEvent} from 'react-event-timeline';

export default class extends Component {
  renderIcon = () => {
    if (this.props.profileImageURL) {
      return <img
                src={this.props.profileImageURL}
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
