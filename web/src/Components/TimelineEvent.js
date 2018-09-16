import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import {Link} from "react-router-dom";
import {TimelineEvent, TimelineBlip} from 'react-event-timeline';
import reportIcon from '../assets/octoicons/report.svg';
import thumbsUp from '../assets/octoicons/thumbsup.svg';
import thumbsDown from '../assets/octoicons/thumbsdown.svg';
import deleteIcon from '../assets/octoicons/trashcan.svg';

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
    return <div className="mt-2 mb-2 row">
      <div className="col-sm-4 col-md-2 col-lg-1">
        <img
          src={this.state.bodyData.photoURL}
          alt="Profile Picture"
          className="d-inline"
          style={{
            width: '100%',
            borderRadius: '20px',
          }}
        />
      </div>
      <div className="col">
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
      </div>
    </div>;
  }

  renderButtons = () => {
    let like = <button className="btn btn-sm">
      <img src={thumbsUp} />
    </button>
    let dislike = <button className="btn btn-sm">
      <img src={thumbsDown} />
    </button>
    let trash = <button className="btn btn-sm">
      <img src={deleteIcon} />
    </button>
    let report = <button className="btn btn-sm">
      <img src={reportIcon} />
    </button>

    if (this.props.authenticated === true) {
      return <i>
        {like}
        {dislike}
        {this.props.title !== 'Followed a user!' &&
            <span>
              {this.props.isMine
                ? trash
                : report
              }
            </span>
        }
      </i>;
    } else {
      return report;
    }
  }

  render() {
    let eventTime = moment(this.props.time, "").fromNow();

    return (
      <div>
        {this.props.body
          ?
            <TimelineEvent
              title={this.renderTitle()}
              createdAt={eventTime}
              icon={this.renderIcon()}
              buttons={this.renderButtons()}
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
