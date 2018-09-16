import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase';
import Timeline from './Timeline';
import TimelineEvent from './TimelineEvent';

export default class extends Component {
  state = {
    events: []
  }

  render() {
    return (
      <Timeline events={this.state.events} global={true} />
    );
  }
}
