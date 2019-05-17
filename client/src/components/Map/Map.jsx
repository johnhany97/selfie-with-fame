/* eslint-disable react/no-find-dom-node */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-string-refs */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const mapStyles = {
  map: {
    width: '100%',
    height: '600px',
  },
};

class CurrentLocation extends React.Component {
  constructor(props) {
    super(props);
    const { initialCenter } = this.props;
    const {
      lat,
      lng,
    } = initialCenter;
    this.state = {
      currentLocation: [lat, lng],
      initialCity: 'Sheffield',
    };
  }

  componentDidMount() {
    const initCity = this.state.initialCity;

    const { handleLocalCityChange } = this.props;
    handleLocalCityChange(initCity);
    const { handleCityChange } = this.props;
    handleCityChange(initCity);

    const { handleLocationChange } = this.props;
    const { currentLocation } = this.state;
    const [lat, lng] = currentLocation;
    handleLocationChange([lat, lng]);
    const { handleSelectedLocationChange } = this.props;
    handleSelectedLocationChange([lat, lng]);
    const { getEventsByLocationAndDate } = this.props;
    getEventsByLocationAndDate();

    const { centerAroundCurrentLocation } = this.props;
    let city_state = 'Sheffield';

    /* global google */

    if (centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { coords } = pos;
          this.setState({
            currentLocation: [coords.latitude, coords.longitude],
          });
          this.geocoder = new google.maps.Geocoder();
          this.geocoder.geocode({ location: { lat: coords.latitude, lng: coords.longitude } }, (results, status) => {
            if (status === 'OK') {
              if (results[0]) {
                results[0].address_components.map((i) => {
                  if (i.types[0] === 'postal_town' || i.types[0] === 'locality') {
                    city_state = i.long_name;
                  }
                });
              } else {
                window.alert('No results found');
              }
            } else {
              window.alert(`Geocoder failed due to: ${status}`);
            }
          });
          const { handleLocalCityChange } = this.props;
          handleLocalCityChange(city_state);
          const { handleCityChange } = this.props;
          handleCityChange(city_state);


          const { handleLocationChange } = this.props;
          const { currentLocation } = this.state;
          const [lat, lng] = currentLocation;
          handleLocationChange([lat, lng]);
          const { handleSelectedLocationChange } = this.props;
          handleSelectedLocationChange([lat, lng]);
          const { getEventsByLocationAndDate } = this.props;
          getEventsByLocationAndDate();
        });
      }
    }
    this.loadMap();
  }

  componentDidUpdate(prevProps, prevState) {
    const { google } = this.props;
    if (prevProps.google !== google) {
      this.loadMap();
    }
    const { currentLocation } = this.state;
    if (prevState.currentLocation !== currentLocation) {
      this.recenterMap();
    }
  }

  loadMap() {
    const { google } = this.props;
    if (this.props && google) { // checks if google is available
      const { maps } = google;
      const mapRef = this.refs.map;

      // reference to the actual DOM element
      const node = ReactDOM.findDOMNode(mapRef);

      const { zoom } = this.props;
      const { currentLocation } = this.state;
      const [lat, lng] = currentLocation;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign(
        {},
        {
          center,
          zoom,
        },
      );
      // maps.Map() is constructor that instantiates the map
      this.map = new maps.Map(node, mapConfig);
    }
  }

  recenterMap() {
    const { currentLocation } = this.state;
    const [lat, lng] = currentLocation;

    const { google } = this.props;
    const { maps } = google;

    if (this.map) {
      const center = new maps.LatLng(lat, lng);
      this.map.panTo(center);
    }
  }


  changeCurrentLoc(new_center) {
    this.setState({
      currentLocation: new_center,
    });
    this.recenterMap();
  }

  renderChildren() {
    const {
      children,
      google,
    } = this.props;
    const { currentLocation } = this.state;
    const [lat, lng] = currentLocation;

    if (!children) {
      return;
    }

    return React.Children.map(children, (c) => {
      if (!c) return;
      return React.cloneElement(c, {
        map: this.map,
        google,
        mapCenter: { lat, lng },
      });
    });
  }

  render() {
    const style = Object.assign({}, mapStyles.map);

    return (
      <div>
        <div style={style} ref="map">
          Loading map...
        </div>
        {this.renderChildren()}
      </div>

    );
  }
}

CurrentLocation.propTypes = {
  google: PropTypes.any,
  children: PropTypes.any,
  zoom: PropTypes.number,
  handleLocationChange: PropTypes.func,
  handleCityChange: PropTypes.func,
  handleLocalCityChange: PropTypes.func,
  handleSelectedLocationChange: PropTypes.func,
  getEventsByLocationAndDate: PropTypes.func,
  centerAroundCurrentLocation: PropTypes.bool,
  initialCenter: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  markers: PropTypes.any,
};


export default CurrentLocation;

CurrentLocation.defaultProps = {
  zoom: 14,
  initialCenter: {
    lat: 53.3811,
    lng: -1.4701,
  },
  centerAroundCurrentLocation: false,
};
