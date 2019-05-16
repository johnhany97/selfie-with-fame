/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import axios from 'axios';
import userProfilePlaceholder from '../../../images/event-img-placeholder.jpg';
import heartOutline from './heart-outline.png';
import heartFilled from './heart-filled.png';
import StoryStepper from '../../StoryStepper';

class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
      text: '',
      pictures: [],
      event: '',
      likes: [],
      comments: [],
      postedBy: '',
      createdAt: '',
      updatedAt: '',
    };
  }

  componentDidMount() {
    this.setState({
      ...this.props,
    });
    this.fetchStory();
  }

  fetchStory = () => {
    console.log("Fetch Story Data");
    const token = localStorage.getItem('JWT');
    axios.get(`/api/stories/${this.props._id}`,
     { headers: { Authorization: `JWT ${token}`} })
      .then((res) => {
        // TODO: Snackbar of success
        console.log("Fetched Story");
        console.log(res.data);
        this.setState({
          ...res.data,
        });
        // Redirect to other page?
      }).catch((error) => {
        console.log(error);
      });
  }

  likeStory = (e) => {
    console.log("Clicked");
    const token = localStorage.getItem('JWT');
    e.preventDefault();
    axios.post(`/api/stories/${this.props._id}/like`, {},
     { headers: { Authorization: `JWT ${token}`} })
      .then(() => {
        // TODO: Snackbar of success
        this.fetchStory();
        // Redirect to other page?
      }).catch((error) => {
        console.log(error);
      });
  }

  convertDateFormat(date) {
    let createAtDate = new Date(date);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = createAtDate.getFullYear();
    var month = months[createAtDate.getMonth()];
    var date = createAtDate.getDate();
    var convertedDate = date + ' ' + month + ' ' + year;
    return convertedDate;
  }
  render() {
    const {
      text,
      pictures,
      createdAt,
      updatedAt,
      postedBy,
      likes,
      liked,
    } = this.props;

    let picBuffers = [];
    if (pictures) {
      for (let i = 0; i < pictures.length; i++) {
        picBuffers.push(new Buffer(pictures[i]).toString('base64'));
      }
    }

    let heartIcon;
    if(this.state.liked){
      heartIcon = <img onClick={this.likeStory} className="heart-story-btn-filled" src={heartFilled} alt="Heart Story button" />;
    } else{
      heartIcon = <img onClick={this.likeStory} className="heart-story-btn" src={heartOutline} alt="Heart Story button" />;
    }

    if (picBuffers.length > 1) {
      return (
        <div className="story-container">
          <div className="story-header">
            <img className="story-user-profile" src={userProfilePlaceholder} alt="User profile" />
            <h4 className="story-username">{postedBy.username}</h4>
            <p className="story-date">{this.convertDateFormat(createdAt)}</p>
          </div>
          {picBuffers && (<StoryStepper pictures={picBuffers} />)}
          <div className="story-btns">
            {heartIcon}
            <p className="story-likes">{this.state.likes.length}</p>
          </div>
          <div className="story-info">
            <div className="story-caption">
              {text}
            </div>
          </div>
        </div>
      );
    }
    else if (picBuffers.length == 1) {
      return (
        <div className="story-container">
          <div className="story-header">
            <img className="story-user-profile" src={userProfilePlaceholder} alt="User profile" />
            <h4 className="story-username">{postedBy.username}</h4>
            <p className="story-date">{this.convertDateFormat(createdAt)}</p>
          </div>
          <React.Fragment>
            <img className="story-img" src={`data:image/jpeg;base64,${picBuffers[0]}`} alt="Story pic" />
          </React.Fragment>
          <div className="story-btns">
            {heartIcon}
            <p className="story-likes">{this.state.likes.length}</p>
          </div>
          <div className="story-info">
            <div className="story-caption">
              {text}
            </div>
          </div>
        </div>
      );
    } else{
      return (
        <div className="story-container">
          <div className="story-header">
            <img className="story-user-profile" src={userProfilePlaceholder} alt="User profile" />
            <h4 className="story-username">{postedBy.username}</h4>
            <p className="story-date">{this.convertDateFormat(createdAt)}</p>
          </div>
          <div className="story-btns">
            {heartIcon}
            <p className="story-likes">{this.state.likes.length}</p>
          </div>
          <div className="story-info">
            <div className="story-caption">
              {text}
            </div>
          </div>
        </div>
      );
    }
  }
};

Story.propTypes = {
  text: PropTypes.string,
  picture: PropTypes.any,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default Story;
