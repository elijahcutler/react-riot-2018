import React, { Component } from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import {TimelineEvent, TimelineBlip} from 'react-event-timeline';

export default class extends Component {
  constructor(props) {
    super(props);

    switch (this.props.title) {
      case 'Followed a user!':
        axios.get(`https://us-central1-gittogether-6f7ce.cloudfunctions.net/getProfile?uid=${this.props.body}`).then(res => {
          this.setState({
            bodyData: res.data
          });
        });
        break;
    }

    this.state = {
      bodyData: null
    }
  }

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

  renderBody = () => {
    switch (this.props.title) {
      case 'Followed a user!':
        return <div>
          {this.state.bodyData
            ? this.renderUserProfile()
            : <p>Loading event data...</p>
          }
        </div>;
      default:
        return this.props.body;
    }
  }

  renderUserProfile = () => {
    return <div className="mt-2 mb-2">
      <img
        src={this.state.bodyData.photoURL}
        alt="Profile Picture"
        className="d-inline"
        style={{
          width: '100px',
          width: '100px',
          borderRadius: '20px',
        }}
      />
      <h3>
        <Link
          className="text-primary"
          to={`/profile/${this.state.bodyData.uid}`}
        >
          {this.state.bodyData.displayName || `@${this.state.bodyData.username}`}
        </Link>
      </h3>
      {this.state.bodyData.displayName &&
        <p>@{this.state.bodyData.username}</p>
      }
    </div>;
  }

  render() {
    let eventTime = Date(this.props.time);

    return (
      <div>
        {this.props.body
          ?
            <TimelineEvent
              title={this.renderTitle()}
              createdAt={eventTime}
              icon={this.renderIcon()}
            >
              <div>
                {this.renderBody()}
              </div>
            </TimelineEvent>
          : <TimelineBlip title={this.renderTitle()} icon={this.renderIcon()} />
        }
      </div>
    );
  }
}
