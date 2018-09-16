import React, { Component } from 'react';
import {Link} from "react-router-dom";
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

  renderTitle = () => {
    return <p>
      <Link
        className="text-primary"
        to={`/profile/${this.props.uid}`}
      >
        {this.props.username}
      </Link> {this.props.title}
    </p>;
  }

  render() {
    return (
      <div>
        {this.props.body
          ?
            <TimelineEvent
              title={this.renderTitle()}
              createdAt={this.props.time}
              icon={this.renderIcon()}
            >
              <div>
                {this.props.body}
              </div>
            </TimelineEvent>
          : <TimelineBlip title={this.renderTitle()} icon={this.renderIcon()} />
        }
      </div>
    );
  }
}
