import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';

export default class extends Component {
  state = {
    authenticated: false,
    idToken: null,
    error: null,
    events: [],
    messageBody: ''
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.auth().currentUser.getIdToken(true).then(idToken => {
          this.setState({
            authenticated: true,
            idToken
          });
          this.fetchTimeline();
        }).catch(error => {
          console.error('Unable to properly authenticate user:', error);
          this.setState({
            authenticated: true,
            error
          });
        });
      } else {
        this.setState({
          authenticated: false
        });
      }
    });
  }

  fetchTimeline = (page = 0) => {
    axios.get('http://localhost:5000/gittogether-6f7ce/us-central1/getTimeline', {
      headers: {
        authorization: `Bearer ${this.state.idToken}`
      }
    }).then(res => {
      console.log(res);
    }).catch(error => {
      this.setState({ error });
    });
  }

  pushTimeLineEvent = () => {
    axios({
      method: 'post',
      url: 'https://us-central1-gittogether-6f7ce.cloudfunctions.net/addTimelineEvent',
      data: {
        body: this.state.messageBody
      },
      headers: {
        authorization: `Bearer ${this.state.idToken}`
      }
    }).then(res => {
      this.setState({
        messageBody: ''
      });
      console.log(res);
    }).catch(error => {
      // TODO: Inform user of this error
      console.error(error);
    });
  }

  handleChange = event => {
    this.setState({
      messageBody: event.target.value
    });
  }

  render() {
    return (
      <div>
        {this.state.authenticated
          ?
          <div>
            {this.state.authenticated === true
              ?
                <div className="container">
                  <Timeline events={this.state.events} global={false} />
                  <div className="fixed-bottom text-center">
                    <div className="card">
                      <div className="card-body">
                        <div className="input-group mb-3">
                          <input
                            value={this.state.messageBody}
                            onChange={this.handleChange}
                            type="text"
                            className="form-control"
                            placeholder="Message"
                          />
                          <div className="input-group-prepend">
                            <button
                              className="btn btn-primary"
                              type="button"
                              onClick={this.pushTimeLineEvent}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              : <h1>You need to login to see the home page...</h1>
            }
          </div>
          : <div />
        }
      </div>
    );
  }
}
