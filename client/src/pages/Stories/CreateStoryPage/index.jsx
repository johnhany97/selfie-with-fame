/* eslint-disable default-case */
import React, { Component } from 'react';
import axios from 'axios';

import Layout from '../../../components/Layout';
import CreateStoryCamera from '../../../components/Stories/CreateStoryCamera';
import CreateStoryEvent from '../../../components/Stories/CreateStoryEvent';
import CreateStoryText from '../../../components/Stories/CreateStoryText';
import Confirmation from '../../../components/Stories/Confirmation';
import { Redirect } from 'react-router-dom';


class CreateStoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      text: '',
      picture: null,
      event: null,
      isLoading: false,
      error: false,
      errorMessage: '',
    };
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handlePhotoChange = (data) => {
    this.setState({
      picture: data,
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
      picture,
      event,
    } = this.state;

    const {
      _id,
    } = event;



    axios.put('/api/stories', {
      text,
      picture,
      event_id: _id,
    }, { headers: { Authorization: `JWT ${token}` } })
      .then(() => {
        // TODO: Snackbar of success
        this.setState({
          isLoading: false,
          error: false,
        });
        this.nextStep();
        // Redirect to other page?
      }).catch((error) => {
        this.setState({
          isLoading: false,
          error: true,
          errorMessage: error.response.data,
        });
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
      picture,
      isLoading,
      error,
      errorMessage,
      event,
    } = this.state;
    const values = { text, picture, event };

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
