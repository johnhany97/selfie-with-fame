/* eslint-disable no-unused-vars */
/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';

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
    };
  }


  onMarkerClick = (props, marker, e) => this.setState({
    selectedPlace: props,
    activeMarker: marker,
    showingInfoWindow: true,
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

  render() {
    return (
      <CurrentLocation
        centerAroundCurrentLocation
        google={this.props.google}
        handleLocationChange={this.props.handleLocationChange}
      >
        <Marker
          onClick={this.onMarkerClick}
          name="current location"
          draggable
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
              buttonText="Select location"
            // onClick={() => this.selectLocation(this.state.selectedPlace)}
            />
          </div>
        </InfoWindow>
      </CurrentLocation>
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
