import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';

export default class extends Component {
  state = {
    events: [],
    loaded: false,
    canLoadMore: false,
    error: null
  }

  componentDidMount() {
    this.fetchTimeline();
  }

  fetchTimeline = (startAt = null) => {
    let query = `${startAt ? `?startAt=${startAt}` : ''}`;
    axios.get(`https://us-central1-gittogether-6f7ce.cloudfunctions.net/getGlobalTimeline${query}`, {
      headers: {
        authorization: `Bearer ${this.state.idToken}`
      }
    }).then(res => {
      if (res.status === 200) {
        if (startAt) {
          res.data.shift();
          if (res.data.length) {
            let newEvents = this.state.events.concat(res.data);
            this.setState({
              events: newEvents,
              canLoadMore: res.data.length === 24,
              loaded: true
            });
          } else {
            this.setState({
              canLoadMore: false
            });
          }
        } else {
          this.setState({
            events: res.data,
            canLoadMore: res.data.length === 25,
            loaded: true
          });
        }
      } else {
        this.setState({
          canLoadMore: false
        });
      }
    }).catch(error => {
      this.setState({
        error,
        loaded: true
      });
      console.error(error);
    });
  }

  loadNextPage = () => {
    this.fetchTimeline(this.state.events.slice(-1).pop().id);
  }

  render() {
    return (
      <div>
       {this.state.loaded
        ?
          <div>
            {!this.state.error
              ?
                <div
                  style={{
                    height: 'calc(100vh - 58px)',
                    maxHeight: 'calc(100vh - 58px)',
                    overflowY: 'scroll'
                  }}
                >
                  <Timeline
                    events={this.state.events}
                    global={true}
                  />
                  {this.state.canLoadMore &&
                    <div className="text-center">
                      <button
                        className=" btn btn-primary btn-raised"
                        onClick={this.loadNextPage}
                      >
                        Load More
                      </button>
                    </div>
                  }
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
        : <div />
      }
      </div>
    );
  }
}
