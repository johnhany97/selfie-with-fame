import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Camera from '../Camera';
import Photo from '../Photo';

class Capture extends Component {
  constructor(props) {
    super(props);

    this.state = {
      constraints: {
        audio: false,
        video: {
          width: 380,
          height: 600,
        },
      },
    };
  }

  componentDidMount() {
    const { constraints } = this.state;
    const getUserMedia = params => (
      new Promise((succcessCb, errorCb) => {
        navigator.webkitGetUserMedia.call(navigator, params, succcessCb, errorCb);
      })
    );

    getUserMedia(constraints)
      .then((stream) => {
        const video = document.querySelector('video');
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        // TODO: Improve this, snackbar?
        console.log(err);
      });

    this.clearPhoto();
  }

  handleStartClick = (e) => {
    e.preventDefault();
    this.takePicture();
  }

  takePicture = () => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const video = document.querySelector('video');
    const photo = document.getElementById('photo');
    // eslint-disable-next-line react/destructuring-assignment
    const { width, height } = this.state.constraints.video;

    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL('image/png');

    const { handlePhotoChange } = this.props;
    handlePhotoChange(data);
    photo.setAttribute('src', data);
  }

  clearPhoto = () => {
    const canvas = document.querySelector('canvas');
    const photo = document.getElementById('photo');
    const context = canvas.getContext('2d');

    const { constraints } = this.state;
    const { video } = constraints;
    const { width, height } = video;

    context.fillStyle = '#FFF';
    context.fillRect(0, 0, width, height);

    const data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }

  render() {
    return (
      <div>
        <Camera
          handleStartClick={this.handleStartClick}
        />
        <canvas
          id="canvas"
          hidden
        />
        <Photo />
      </div>
    );
  }
}

Capture.propTypes = {
  handlePhotoChange: PropTypes.func.isRequired,
};

export default Capture;
