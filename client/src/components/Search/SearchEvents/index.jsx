/* eslint-disable no-unused-vars */
/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';



import './index.css';
import searchButton from '../../../images/round-search.png';
import { inputStyle } from '../../../styles/buttonStyles';
import { errorMessage } from '../../../styles/formStyles';

class SearchEvents extends Component {
  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
    this.placeDetails = null
    this.geocoder = null
    
    /*global google*/
    this.state = {
      query: 'Sheffield',
      city: 'Sheffield',
      showError: false,
      displayedEvents: [],
      eventQuery: '',

      end_date: new Date(),
      start_date: new Date(),
      // start_date: new Date((new Date()).setFullYear( new Date().getFullYear() - 1 )),

    };




  }

  async componentDidMount() {


    var options = { types: ['(cities)'] };


    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), options);
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);

    this.placeDetails = new google.maps.places.PlacesService(this.props.google);
    this.geocoder = new google.maps.Geocoder;
    this.getEventsByLocationAndDate();




  }


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

      this.props.mapElement.current.changeCurrentLoc([addressObject.geometry.location.lat(), addressObject.geometry.location.lng()]);
      const { handleLocationChange } = this.props;
      const { handleCityChange } = this.props;
      handleLocationChange(this.state.selectedPlace);
      handleCityChange(this.state.city)

      this.getEventsByLocationAndDate();



    }
    else {
      console.log("this is not an address");
    }
  }




  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleQueryChange= name => (event) => {
    this.setState({
      [name]: event.target.value,
    });

    if (event.target.value == "") {
      this.setState({
        city: "",
      });


    }

  };


  

  

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
        this.props.handleDisplayedEventsChange(events)

        if (!events == undefined || !events.length == 0) {
          this.props.mapElement.current.changeCurrentLoc([events[0].location['coordinates'][0], events[0].location['coordinates'][1]]);

        
        }

      }).catch((err) => {
        this.setState({
          showError: true,
        });
      });
  }


  

  

  render() {
    const {
      displayedEvents,
      address_search,
      showError
    } = this.state;

    return (
      <div>
        <div>
          <h3 className="search-location-title">Search Events</h3>
          <hr className="search-location-divider" />
          <form  className="panel-center">
            <TextField
                style={inputStyle}
                label="Event"
                value={this.state.eventQuery}
                onChange={this.handleChange('eventQuery')}
                placeholder="All"
            />
            <TextField
                style={inputStyle}
                id="autocomplete"
                label="City"
                value={this.state.query}
                onChange={this.handleQueryChange("query")}
                placeholder="Sheffield"
            />
            <TextField
                style={inputStyle}
                id="start_date"
                label="Event occuring between this date "
                type="datetime-local"
                onChange={this.handleChange('start_date')}
                value={new Date(this.state.start_date).toISOString().substring(0, 16)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            <TextField
                style={inputStyle}
                id="end_date"
                label="and this date"
                type="datetime-local"
                onChange={this.handleChange('end_date')}
                value={new Date(this.state.end_date).toISOString().substring(0, 16)}
                InputLabelProps={{
                  shrink: true,
                }}
            />
            {showError &&  (
                <p
                  style={errorMessage}
                >
                  *Address is a required field.
                </p>
              )}

          </form>
          
          <button  className="round-search-btn" onClick={this.getEventsByLocationAndDate}>
            <img className="search-icon" src={searchButton} alt="Search Location Button"/>
          </button>
        </div>
      </div>
    );

  }
} 

SearchEvents.propTypes = {

    handleDisplayedEventsChange: PropTypes.func.isRequired,
    mapElement: PropTypes.object,
  
};
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDwl44l9AwolJXOOTPgoVuFNFrgPeXSz7s',
})(SearchEvents);
