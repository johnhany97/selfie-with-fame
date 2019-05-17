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
  errorMessage,
} from '../../styles/formStyles';

import {
  inputStyle,
} from '../../styles/buttonStyles';

import './index.css';
import searchButton from './../../images/round-search.png';
import CurrentLocation from '../../components/Map/Map';
import SearchEvents from '../Search/SearchEvents';

/**
 * @Params
 * handleLocationChange => method passed through props to handle 
 * the locaiton change
 * handleCityChange => method passed through props to handle
 * the city change
 * 
 * @summary
 * Displays map allowing the user to select an event 
 * from a GoogleMap component
 * 
 * @returns
 * Returns JSX component that contains a GoogleMap component 
 * to select events from
 */
class SelectEvent extends Component {
  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.placeDetails = null
    this.geocoder = null
    /*global google*/
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: [],
      query: '',
      city: 'Sheffield',
      showError: false,
      displayedEvents: [],
      marker_clicked: ' ',
      selected_event: [],
      mapElement: React.createRef(),

      end_date: new Date(),
      start_date: new Date(),
      mode: "onGoing",
      // start_date: new Date((new Date()).setFullYear( new Date().getFullYear() - 1 )),

    };




  }

  async componentDidMount() {


    var options = { types: ['(cities)'] };


    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), options);
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);

    this.placeDetails = new google.maps.places.PlacesService(this.props.google);
    this.geocoder = new google.maps.Geocoder();
    this.getEventsByLocationAndDate();




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

      this.state.mapElement.current.changeCurrentLoc([addressObject.geometry.location.lat(), addressObject.geometry.location.lng()]);
      const { handleLocationChange } = this.props;
      const { handleCityChange } = this.props;
      handleLocationChange(this.state.selectedPlace);
      handleCityChange(this.state.city)

      this.getEventsByLocationAndDate();



    }
    else {
    }
  }



  onMarkerClick = (props, marker, e) => this.setState({
    activeMarker: marker,
    showingInfoWindow: true,
    marker_clicked: "my marker",
    selected_event: props

  });

  onOtherMarkerClick = (props, marker, e) => {
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true,
      marker_clicked: "other event marker",
      selected_event: props,
      chosen_event: marker.event,
    });
    this.props.handleEventChange(this.state.chosen_event)

  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleDisplayedEventsChange = (data) => {
    this.setState({
      displayedEvents: data,
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

  getEventsById = (id) => {
    const token = localStorage.getItem('JWT');
    if (token == null) {
      this.setState({
        showError: true,
      });
      return;
    }
   
    axios.get(`/api/events/${id}`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        }
      }).then((res) => {
        const { data } = res;
        const {
          event,
        } = data;
        this.setState({
          chosen_event: event,
          showError: false,
        });
      }).catch((err) => {
        this.setState({
          showError: true,
        });
      });
  }

  

  
  getEventsByLocationAndDate = async () => {
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
      city,
      eventQuery
    } = this.state;
    let end_date_displayEvents =start_date
    let city_displayEvents = city
    let start_date_displayEvents = end_date
    axios.post('/api/events/getEventsByLocationAndDate',
      {
        city_displayEvents,
        end_date_displayEvents,
        start_date_displayEvents,
        eventQuery,
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
        this.props.handleDisplayedEventsChange()

      }).catch((err) => {
        this.setState({
          showError: true,
        });
      });
  }


  arrayTodict(array) {
    var dictionary_loc = { lat: array[0], lng: array[1] };
    return dictionary_loc;
  };

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
    console.log("the displayed events")
    console.log(displayedEvents)

    // var event_name = this.props.topLevelEvent.name;
    var event_name = ''
    if (this.props.topLevelEvent === null) {
      event_name = "No event selected";
    }
    else {  
      event_name = this.props.topLevelEvent.name
    }

    return (
      <div>

        <h3 className="search-location-title">Selected Event</h3>
        <hr className="search-location-divider" />
          <TextField
              style={inputStyle}
              value={event_name}
              onChange={this.handleChange('eventQuery')}
              disabled
          />


        <SearchEvents
          mapElement = {this.state.mapElement}
          handleDisplayedEventsChange = {this.handleDisplayedEventsChange}
          handleLocationChange={this.props.handleLocationChange}
          handleCityChange={this.props.handleCityChange}


        />
        <CurrentLocation
          ref={this.state.mapElement}
          centerAroundCurrentLocation
          google={this.props.google}
          handleLocationChange={this.props.handleLocationChange}
          handleCityChange={this.props.handleCityChange}
          handleSelectedLocationChange={this.handleSelectedLocationChange}
          handleLocalCityChange={this.handleLocalCityChange}
          getEventsByLocationAndDate={this.getEventsByLocationAndDate}
          markers={displayedEvents}
        >
          
          {displayedEvents.map(event => (
            <Marker key={event._id}
              onClick={this.onOtherMarkerClick}
              event = {event}
              name={event.name}
              info={event.information}
              position={this.arrayTodict(event.location["coordinates"])}


            />

          ))}

          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
            onClose={this.onClose}
          >
            <div>
              <p style={{color:"blue"}}> Selected Event</p>
              <h4>{this.state.selected_event.name}</h4>
              <p> {this.state.selected_event.info}</p>

            </div>
          </InfoWindow>
        </CurrentLocation>


      </div>
    );

  }
}

SelectEvent.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      handleLocationChange: PropTypes.func.isRequired,
      handleCityChange: PropTypes.func.isRequired,
      handleEventChange: PropTypes.func.isRequired,
      topLevelEvent: PropTypes.object,


    }),
  }),
};
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDwl44l9AwolJXOOTPgoVuFNFrgPeXSz7s',
})(SelectEvent);
