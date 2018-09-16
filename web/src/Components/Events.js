import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';

export default class extends Component {
  state = {
    events: [],
    loaded: false
  }

  componentDidMount() {
    this.fetchTimeline();
  }

  fetchTimeline = (page = 0) => {
    axios.get('http://localhost:5000/gittogether-6f7ce/us-central1/getGlobalTimeline', {
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
        loaded: true
      });
      console.error(error);
    });
  }

  render() {
    return (
      <div>
       {this.state.loaded
        ? <Timeline events={this.state.events} global={true} />
        : <div />
      }
      </div>
    );
  }
}
