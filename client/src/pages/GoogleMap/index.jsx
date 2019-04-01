import React, { Component } from 'react';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import SubmitButton from '../../components/SubmitButton';
import PropTypes from 'prop-types';

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
    }

  }


  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  handleMarkerDragEnd(props, marker, coord) {
    var latitude = coord.latLng.lat();
    var longitude = coord.latLng.lng();
    this.setState({
      selectedPlace: [latitude, longitude],
      activeMarker: marker,
      showingInfoWindow: true
    });
    const { handleLocationChange } = this.props;
    handleLocationChange(this.state.selectedPlace);
  }
  
  render() {

    return (
      <CurrentLocation centerAroundCurrentLocation google={this.props.google} handleLocationChange={this.props.handleLocationChange}>
        <Marker 
          onClick={this.onMarkerClick} name={'current location'}
          draggable={true}
          onDragend={(t, map, coord) => this.handleMarkerDragEnd(t, map, coord)}
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
            <SubmitButton
              buttonStyle={saveButton}
              variant="contained"
              color="primary"
              buttonText = "Select location"
              //onClick={() => this.selectLocation(this.state.selectedPlace)}
            />
          </div>
        </InfoWindow>
      </CurrentLocation>
    );
  }
}

GoogleMap.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      handleLocationChange: PropTypes.func.isRequired,
    }),
  }),
};
export default GoogleApiWrapper({
  apiKey: 'AIzaSyDwl44l9AwolJXOOTPgoVuFNFrgPeXSz7s'
})(GoogleMap);
