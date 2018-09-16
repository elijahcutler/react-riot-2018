import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';

export default class extends Component {
  state = {
    events: [],
    loaded: false,
    error: null
  }

  componentDidMount() {
    this.fetchTimeline();
  }

  fetchTimeline = (page = 0) => {
    axios.get('https://us-central1-gittogether-6f7ce.cloudfunctions.net/getGlobalTimeline', {
      headers: {
        authorization: `Bearer ${this.state.idToken}`
      }
    }).then(res => {
      this.setState({
        events: res.data,
        loaded: true
      });
    }).catch(error => {
      this.setState({
        error,
        loaded: true
      });
      console.error(error);
    });
  }

  render() {
    return (
      <div>
       {this.state.loaded
        ?
          <div>
            {!this.state.error
              ?
                <Timeline
                  style={{
                    height: 'calc(100vh - 57px)',
                    maxHeight: 'calc(100vh - 57px)',
                    overflowY: 'scroll'
                  }}
                  events={this.state.events}
                  global={true}
                />
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
        : <div />
      }
      </div>
    );
  }
}
