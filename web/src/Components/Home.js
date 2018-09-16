import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';
import Lander from './Lander';

export default class extends Component {
  state = {
    authenticated: false,
    idToken: null,
    loaded: false,
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
            loaded: true,
            authenticated: true,
            error
          });
        });
      } else {
        this.setState({
          loaded: true,
          authenticated: false
        });
      }
    });
  }

  fetchTimeline = (page = 0) => {
    axios.get('https://us-central1-gittogether-6f7ce.cloudfunctions.net/getTimeline', {
      headers: {
        authorization: `Bearer ${this.state.idToken}`
      }
    }).then(res => {
      this.setState({
        loaded: true,
        events: res.data
      });
    }).catch(error => {
      this.setState({
        loaded: true,
        error
      });
      console.error(error);
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

  handleKeyPress = press => {
    if (press.key === "Enter") {
      this.pushTimeLineEvent();
    }
  }

  render() {
    return (
      <div>
        {this.state.loaded
          ?
          <div>
            {this.state.authenticated
              ?
                <div>
                  {!this.state.error
                    ?
                      <div>
                        <Timeline
                          style={{
                            height: 'calc(100vh - 56px - 97px)',
                            maxHeight: 'calc(100vh - 56px - 97px)',
                            overflowY: 'scroll'
                          }}
                          events={this.state.events}
                          global={false}
                        />
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
                                  onKeyDown={this.handleKeyPress}
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
                    :
                      <div className="mx-auto text-center mt-2">
                        <h2>Uh oh!</h2>
                        <p>
                          An error occurred! You can check the console to see what
                          happend and submit an issue <a
                            href="https://github.com/Hackbit/GitTogether/issues"
                            target="_blank"
                          >
                            here
                          </a> to get it resolved.
                        </p>
                      </div>
                  }
                </div>
              : <Lander />
            }
          </div>
          : <div />
        }
      </div>
    );
  }
}
