/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { Component } from 'react';

import Camera from '../Camera';
import Photo from '../Photo';
import './index.css';


/**
 * @Params
 * removePicture => remove picture method passed down through props
 * 
 * @summary
 * Displays canvas that will display captured frame from video and saves it 
 * as a PNG.
 * 
 * @returns
 * Returns JSX component for displaying canvas element and thumbnail images
 * of captured images.
 */
class Capture extends Component {
  constructor(props) {
    super(props);

    this.state = {
      constraints: {
        audio: false,
        video: {
          width: 300,
          height: 400,
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
    // eslint-disable-next-line react/destructuring-assignment
    const { width, height } = this.state.constraints.video;

    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    const data = canvas.toDataURL('image/png');

    const { onAddPicture } = this.props;
    onAddPicture(data);
  }

  clearPhoto = () => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    const { constraints } = this.state;
    const { video } = constraints;
    const { width, height } = video;

    context.fillStyle = '#FFF';
    context.fillRect(0, 0, width, height);

    canvas.toDataURL('image/png');
  }

  render() {
    const { removePicture } = this.props;
    return (
      <div className="camera-container">
        <Camera
          handleStartClick={this.handleStartClick}
        />
        <canvas
          className="image-preview"
          id="canvas"
          hidden
        />
        <div className="thumbnails-container-preview">
          {this.props.values.pictures.map((data, index) => (
            <Photo key={index} data={data} index={index} removePicture={removePicture} />))}
        </div>
      </div>
    );
  }
}

export default Capture;
