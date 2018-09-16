import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios'
import csv from 'csvtojson';
import firebase from './firebase';

class MLHCalendar extends Component {
  state = {
    location: 'na',
    year: 2019,
    events: []
  }

  componentDidMount() {
    this.getEventData();
  }

  getEventData = (location = 'na', year = 2019) => {
    var storage = firebase.storage();
    var pathReference = storage.ref(`eventData/${location}/${year}.csv`);
    pathReference.getDownloadURL().then(url => {
      axios.get(url).then(res => {
        csv().fromString(res.data).then(events =>{
          this.setState({
            events
          });
        });
      }).catch(error => {
        console.error('axios', error);
      })
    }).catch(error => {
      console.error(error);
    });
  }

  handleLocationChange = event => {
    this.setState({
      location: event.target.value
    });
    this.getEventData(event.target.value, this.state.year);
  }

  handleYearChange = event => {
    this.setState({
      year: event.target.value
    });
    this.getEventData(this.state.location, event.target.value);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="form-group col-3">
            <label className="bmd-label-floating">Location</label>
            <select
              className="form-control"
              onChange={this.handleLocationChange}
            >
              <option value="na">North America</option>
              <option value="eu">Eurpoe</option>
            </select>
          </div>
            <div className="form-group col-3">
              <label className="bmd-label-floating">Year</label>
              <select
                className="form-control"
                onChange={this.handleYearChange}
              >
                <option>2019</option>
                <option>2018</option>
                <option>2017</option>
              </select>
            </div>
        </div>
        <div className="row table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Events</th>
              </tr>
            </thead>
            <tbody>
              {this.state.events.map(event => {
                return (
                  <tr key={`${event.name}-${event.startDate}`}>
                    <td className="row">
                      <div className="col-sm-3 col-md-2">
                        <img src={event.icon} />
                      </div>
                      <div className="col">
                        <h3>
                          <a href={event.website} target="_blank">{event.name}</a>
                        </h3>
                        <p>
                          {event.startDate} - {event.endDate}
                          <br />
                          {event.city}, {event.state}
                        </p>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default withRouter(MLHCalendar);
