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

import {
  inputStyle,
} from '../../styles/buttonStyles';

import SubmitButton from '../../components/SubmitButton';
import {
  saveButton,
} from '../../styles/buttonStyles';
import CurrentLocation from './Map';

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.mapElement = React.createRef();
    this.placeDetails = null
    this.geocoder = null
    /*global google*/
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: [],
      query: '',
      city: '',
      showError: false,
      displayedEvents: [],
      marker_clicked: ' ',
      selected_event: [],
    };




  }

  async componentDidMount() {

    var options = { types: ['(cities)'] };

    // To disable any eslint 'google not defined' errors

    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), options);
    // Fire Event when a suggested name is selected
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);

    this.placeDetails = new google.maps.places.PlacesService(this.props.google);
    //  this.autocomplete.setFields(
    //     ['address_components', 'geometry']);
    this.geocoder = new google.maps.Geocoder;
    this.getEventsLocation();




  }

  handleLocalCityChange = (data) => {
    this.setState({
      city: data,
    });

  };

  handlePlaceSelect() {

    // Extract City From Address Object
    let addressObject = this.autocomplete.getPlace();
    let address = addressObject.address_components;


    // Check if address is valid
    if (address) {
      // Set State
      this.setState(
        {
          city: address[0].long_name,
          query: addressObject.formatted_address,
          selectedPlace: [addressObject.geometry.location.lat(), addressObject.geometry.location.lng()]
        }
      );

      this.mapElement.current.changeCurrentLoc([addressObject.geometry.location.lat(), addressObject.geometry.location.lng()]);
      const { handleLocationChange } = this.props;
      const { handleCityChange } = this.props;
      handleLocationChange(this.state.selectedPlace);
      handleCityChange(this.state.city)

      this.getEventsLocation();



    }
    else {
      console.log("not an address")
    }
  }



  onMarkerClick = (props, marker, e) => this.setState({
    activeMarker: marker,
    showingInfoWindow: true,
    marker_clicked: "my marker",
    selected_event: props

  });

  onOtherMarkerClick = (props, marker, e) => this.setState({
    activeMarker: marker,
    showingInfoWindow: true,
    marker_clicked: "other event marker",
    selected_event: props,

  });

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

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

    //let place = this.placeDetails.getDetails(coord)
    /*global google*/

    var city_state = this.state.city

    this.geocoder.geocode({ 'location': { "lat": latitude, "lng": longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          results[0].address_components.map(i => {
            if (i.types[0] == "postal_town" || i.types[0] == "locality") {
              city_state = i.long_name
            }
          });
        }
      }

      this.setState({
        selectedPlace: [latitude, longitude],
        activeMarker: marker,
        showingInfoWindow: true,
        city: city_state,
      });

      const { handleLocationChange } = this.props;
      const { handleCityChange } = this.props;


      handleLocationChange(this.state.selectedPlace);
      handleCityChange(this.state.city);
      this.getEventsLocation();

    });
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

  getEventsLocation = async () => {
    const token = localStorage.getItem('JWT');
    if (token == null) {
      this.setState({
        showError: true,
      });
      return;
    }
    const {
      start_date,
      end_date,
      location,
      city,
    } = this.state;

    axios.post('/api/events/getEventsByLocation',
      {
        city
      },
      {
        headers: {
          Authorization: `JWT ${token}`,
        }
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
    var dictionary_loc = { lat: array[0], lng: array[1] };
    return dictionary_loc;
  }

  handleSelectedLocationChange = (data) => {
    this.setState({
      selectedPlace: data,
    });
  };


  render() {
    const {
      displayedEvents,
      address_search,
      showError
    } = this.state;

    return (
      <div>
        <div className="container" style={mTop}>
          <h3 style={formTitle}>Search</h3>
          <hr style={formDividor} />
          <form onSubmit={this.getEventsLocation} className="panel-center">
            <TextField
              style={inputStyle}
              id="autocomplete"
              label="Address"
              value={this.state.query}
              onChange={this.handleChange('query')}
              placeholder="Current Location"
            />
            {showError && (
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
          ref={this.mapElement}
          centerAroundCurrentLocation
          google={this.props.google}
          handleLocationChange={this.props.handleLocationChange}
          handleCityChange={this.props.handleCityChange}
          handleSelectedLocationChange={this.handleSelectedLocationChange}
          handleLocalCityChange={this.handleLocalCityChange}
          getEventsLocation={this.getEventsLocation}
          markers={displayedEvents}
        >
          
          {displayedEvents.map(event => (
            <Marker key={event._id}
              onClick={this.onOtherMarkerClick}
              name={event.name}
              info={event.information}
              position={this.arrayTodict(event.location["coordinates"])}


            />

          ))}
          <Marker
            onClick={this.onMarkerClick}
            position={{
              lat: this.state.selectedPlace[0],
              lng: this.state.selectedPlace[1]
            }}
            name="Selected Location"
            info="Where the new event will be."
            icon={
              "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }
            optimized= {false}
            zIndex={99999999}
            draggable
            onDragend={(t, map, coord) => this.handleMarkerDragEnd(t, map, coord)}
          />


          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <h4>{this.state.selected_event.name}</h4>
              <p> {this.state.selected_event.info}</p>

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
      handleCityChange: PropTypes.func.isRequired,
    }),
  }),
};
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDwl44l9AwolJXOOTPgoVuFNFrgPeXSz7s',
})(GoogleMap);
