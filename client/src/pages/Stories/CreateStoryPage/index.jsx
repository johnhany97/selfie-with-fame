/* eslint-disable default-case */
import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import Layout from '../../../components/Layout';
import CreateStoryCamera from '../../../components/Stories/CreateStoryCamera';
import CreateStoryEvent from '../../../components/Stories/CreateStoryEvent';
import CreateStoryText from '../../../components/Stories/CreateStoryText';
import Confirmation from '../../../components/Stories/Confirmation';
import DB, { OFFLINE_STORIES_STORE_NAME, EVENTS_STORE_NAME } from '../../../db/db';

class CreateStoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      text: '',
      pictures: [],
      event: null,
      isLoading: false,
      error: false,
      errorMessage: '',
    };
  }

  onAddPicture = (data) => {
    // not allowed AND not working
    this.setState(state => {
      const pictures = state.pictures.concat(data);
      return {
        pictures,
      };
    });
  };

  removePicture = (index) => {
    if (index !== -1) {
      this.state.pictures.splice(index, 1);
      this.setState({pictures: this.state.pictures});
    }
  };

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleEventChange = (event) => {
    this.setState({
      event,
    });
  }

  createStory = (e) => {
    this.setState({
      isLoading: true,
    });
    const token = localStorage.getItem('JWT');
    if (token === null) {
      this.setState({
        isLoading: false,
        error: true,
        errorMessage: 'Unauthorized - Please try to login',
      });
    }
    e.preventDefault();
    const {
      text,
      pictures,
      event,
    } = this.state;

    const {
      _id,
    } = event;

    axios.post('/api/stories', {
      text,
      pictures,
      event_id: _id,
    }, { headers: { Authorization: `JWT ${token}`} })
      .then(() => {
        // TODO: Snackbar of success
        this.setState({
          isLoading: false,
          error: false,
        });
        this.nextStep();
      }).catch((error) => {
        if (!error.status) { // was offline, use indexeddb
          console.log('because I was offline');
          // Store in IDB for later consumption
          DB.set(OFFLINE_STORIES_STORE_NAME, {
            text,
            pictures,
            event,
          });
        } else { // was not offline
          this.setState({
            isLoading: false,
            error: true,
            errorMessage: error.response.data,
          });
        }
      });
  }

  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1,
    });
  }

  previousStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1,
    });
  }

  // eslint-disable-next-line consistent-return
  render() {
    const {
      step,
      text,
      pictures,
      isLoading,
      error,
      errorMessage,
      event,
    } = this.state;
    const values = { text, pictures, event };

    if (isLoading) {
      return (
        <Layout title="Create Story">
          <h1>Loading...</h1>
        </Layout>
      );
    }

    if (error) {
      return (
        <Layout title="Create Story">
          <h1>{errorMessage}</h1>
        </Layout>        
      );
    }
    switch (step) {
      case 1: // Adding image
        return (
          <Layout title="Create Story">
            <CreateStoryCamera
              nextStep={this.nextStep}
              previousStep={this.previousStep}
              handlePhotoChange={this.handlePhotoChange}
              step={step}
              values={values}
              onAddPicture={this.onAddPicture}
              removePicture={this.removePicture}
            />
          </Layout>
        );
      case 2: // Event selection
        return (
          <Layout title="Create Story">
            <CreateStoryEvent
              nextStep={this.nextStep}
              previousStep={this.previousStep}
              handleEventChange={this.handleEventChange}
              values={values}
              step={step}
            />
          </Layout>
        );
      case 3: // Adding text
        return (
          <Layout title="Create Story">
            <CreateStoryText
              nextStep={this.nextStep}
              previousStep={this.previousStep}
              handleChange={this.handleChange}
              step={step}
            />
          </Layout>
        );
      case 4: // Confirmation
        return (
          <Layout title="Create Story">
            <Confirmation
              createStory={this.createStory}
              previousStep={this.previousStep}
              handleChange={this.handleChange}
              values={values}
              step={step}
            />
          </Layout>
        );
      default: // case 5: Success
        return (
          <Layout title="Create Story">
            <Redirect to={`/eventPage/${this.state.event._id}`} />
          </Layout>
        );
    }
  }
}

export default CreateStoryPage;
