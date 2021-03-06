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
      bodyData: null,
      didLike: false,
      didDislike: false,
      didDelete: false
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

  renderInteractions = () => {
    let likes = this.props.likes + (this.state.didLike ? 1 : 0);
    let dislikes = this.props.dislikes + (this.state.didDislike ? 1 : 0);

    return <div>
      <button
        className="btn btn-primary btn-raised btn-sm"
        onClick={this.likeEvent}
      >
        {likes}  <img src={thumbsUp} style={{marginTop: '-5px'}} />
      </button>
      <button
        className="btn btn-danger btn-raised btn-sm ml-1"
        onClick={this.dislikeEvent}
      >
        {dislikes}  <img src={thumbsDown} style={{marginTop: '-5px'}} />
      </button>
    </div>;
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
        return <div>
          <p>{this.props.body}</p>
          {this.renderInteractions()}
        </div>;
    }
  }

  renderUserProfile = () => {
    return <div>
      <div className="mt-2 mb-2 row">
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
      </div>
      {this.renderInteractions()}
    </div>;
  }

  renderButtons = () => {
    let trash = <button
      className="btn btn-sm"
      onClick={this.deleteEvent}
    >
      <img src={deleteIcon} />
    </button>
    let report = <button
      className="btn btn-sm"
      onClick={this.reportEvent}
    >
      <img src={reportIcon} />
    </button>

    if (this.props.authenticated === true) {
      return <i>
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

  likeEvent = () => {
    if (this.props.authenticated) {
      axios({
        method: 'post',
        url: 'https://us-central1-gittogether-6f7ce.cloudfunctions.net/preformEventAction',
        data: {
          id: this.props.id,
          type: 'like'
        },
        headers: {
          authorization: `Bearer ${this.props.idToken}`
        }
      }).then(res => {
        this.setState({
          didLike: true
        });
      }).catch(error => {
        console.error(error);
        alert('Unable to interact with event!');
      });
    } else {
      console.error('Unable to interact with this event, you must be authenticated.');
    }
  }

  dislikeEvent = () => {
    if (this.props.authenticated) {
      axios({
        method: 'post',
        url: 'https://us-central1-gittogether-6f7ce.cloudfunctions.net/preformEventAction',
        data: {
          id: this.props.id,
          type: 'dislike'
        },
        headers: {
          authorization: `Bearer ${this.props.idToken}`
        }
      }).then(res => {
        this.setState({
          didDislike: true
        });
      }).catch(error => {
        console.error(error);
        alert('Unable to interact with event!');
      });
    } else {
      console.error('Unable to interact with this event, you must be authenticated.');
    }
  }

  reportEvent = () => {
    if (this.props.authenticated) {
      axios({
        method: 'post',
        url: 'https://us-central1-gittogether-6f7ce.cloudfunctions.net/preformEventAction',
        data: {
          id: this.props.id,
          type: 'report'
        },
        headers: {
          authorization: `Bearer ${this.props.idToken}`
        }
      }).then(res => {
        alert('Report submitted.');
      }).catch(error => {
        console.error(error);
        alert('Unable to submit report!');
      });
    } else {
      axios({
        method: 'post',
        url: 'https://us-central1-gittogether-6f7ce.cloudfunctions.net/reportEvent',
        data: {
          id: this.props.id
        }
      }).then(res => {
        alert('Report submitted.');
      }).catch(error => {
        console.error(error);
        alert('Unable to submit report!');
      });
    }
  }

  deleteEvent = () => {
    if (this.props.authenticated) {
      axios({
        method: 'post',
        url: 'https://us-central1-gittogether-6f7ce.cloudfunctions.net/deleteEvent',
        data: {
          id: this.props.id
        },
        headers: {
          authorization: `Bearer ${this.props.idToken}`
        }
      }).then(res => {
        this.setState({
          didDelete: true
        });
      }).catch(error => {
        console.error(error);
        alert('Unable to interact with event!');
      });
    } else {
      console.error('Unable to interact with this event, you must be authenticated.');
    }
  }

  render() {
    let eventTime = moment(this.props.time, "").fromNow();

    return (
      <div hidden={this.state.didDelete}>
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
