/* eslint-disable no-unused-vars */
/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';

import {
  formTitle,
  formDividor,
  formSubmitButton,
  mTop,
  cancelLink,
  errorMessage,
} from '../../styles/formStyles';

import SubmitButton from '../../components/SubmitButton';
import {
  saveButton,
} from '../../styles/buttonStyles';
import CurrentLocation from './Map';

class GoogleMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: [],
      address_search: '',
      showError: false,
      displayedEvents: [],
      marker_clicked: ' ',
      selected_name: '',
    };
  }

  async componentDidMount() {
    await this.getEvents();
  }


  onMarkerClick = (props, marker, e) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingInfoWindow: true,
    marker_clicked: "my marker",
    selected_name: props.name,

  });

  onOtherMarkerClick = (props, marker, e) => this.setState({
    activeMarker: marker,
    showingInfoWindow: true,
    marker_clicked: "other event marker",
    selected_name: props.name,

  });

  

  onClose = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    }
  };

  handleMarkerDragEnd(props, marker, coord) {
    const latitude = coord.latLng.lat();
    const longitude = coord.latLng.lng();
    this.setState({
      selectedPlace: [latitude, longitude],
      activeMarker: marker,
      showingInfoWindow: true,
    });
    const { handleLocationChange } = this.props;
    handleLocationChange(this.state.selectedPlace);
  }

  getEvents = async () => {
    const token = localStorage.getItem('JWT');
    if (token == null) {
      this.setState({
        showError: true,
      });
      return;
    }
    axios.get('/api/events/getEvents', {
      params: {
      },
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then((res) => {
      const { data } = res;
      const {
        events,
      } = data;
      this.setState({
        displayedEvents: events,
        showError: false,
      });
    }).catch((err) => {
      console.error(err.response.data);
      this.setState({
        showError: true,
      });
    });
  }

  getEventsLocation =  (event) => {
    const token = localStorage.getItem('JWT');
    if (token == null) {
      this.setState({
        showError: true,
      });
      return;
    }
    event.preventDefault();

    axios.get('/api/events/getEvents', {
      params: {
      },
      headers: {
        Authorization: `JWT ${token}`,
      },
    }).then((res) => {
      const { data } = res;
      const {
        events,
      } = data;
      this.setState({
        displayedEvents: events,
        showError: false,
      });
    }).catch((err) => {
      console.error(err.response.data);
      this.setState({
        showError: true,
      });
    });
  }


  arrayTodict(array) {
    var dictionary_loc = {lat: array[0], lng: array[1]};
    console.log("location dictionaryised is " + dictionary_loc['lat'] + ", " +  dictionary_loc['lng'])
    return dictionary_loc;
  }


  render() {
    const {
      displayedEvents,
      address_search,
      showError
    } = this.state;
    console.log("displauyed events: ");
    console.log(displayedEvents);
    console.log("marker clicked: ", this.state.marker_clicked);
    return (
      <div>
        <div className="container" style={mTop}>
          <h3 style={formTitle}>Search</h3>
          <hr style={formDividor} />
          <form onSubmit={this.getEventsLocation} className="panel-center">
            <TextField
              id="address_search"
              label="Address"
              value={address_search}
              onChange={this.handleChange}
              placeholder="Current Location"
            />
            {showError &&  (
              <p
                style={errorMessage}
              >
                *Address is a required field.
              </p>
            )}
            <SubmitButton
              buttonStyle={formSubmitButton}
              buttonText="Search"
            />
          </form>
        </div>

        <CurrentLocation
          centerAroundCurrentLocation
          google={this.props.google}
          handleLocationChange={this.props.handleLocationChange}
          markers = {displayedEvents}
        >
          <Marker
            onClick={this.onMarkerClick}
            name="Selected Location"
            draggable
            onDragend={(t, map, coord) => this.handleMarkerDragEnd(t, map, coord)}
          />
         


          {displayedEvents.map(event => (
            <Marker key={event._id}
              onClick={this.onOtherMarkerClick}
              name={event.event_name}
              position= {this.arrayTodict(event.location)}

            />
       
          ))}

          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <h4>{this.state.selected_name}</h4>
              <SubmitButton
                buttonStyle={saveButton}
                variant="contained"
                color="secondary"
                buttonText="Select location"
              />
            </div>
          </InfoWindow>
        </CurrentLocation>



       
      </div>
    );
  }
}

GoogleMap.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      handleLocationChange: PropTypes.func.isRequired,
    }),
  }),
};
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDwl44l9AwolJXOOTPgoVuFNFrgPeXSz7s',
})(GoogleMap);
