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
import { TextField } from '@material-ui/core';
import classNames from 'classnames';

class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: false,
      text: '',
      pictures: [],
      event: '',
      likes: [],
      numLikes: 0,
      comments: [],
      postedBy: '',
      createdAt: '',
      updatedAt: '',
      commentText: '',
    };

  }

  componentDidMount() {
    this.setState({
      ...this.props,
    });
    this.state.numLikes = this.props.likes.length;
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
    this.setState({
      liked: true,
      numLikes: (this.state.numLikes + 1),
    });
    const token = localStorage.getItem('JWT');
    e.preventDefault();
    axios.post(`/api/stories/${this.props._id}/like`, {},
     { headers: { Authorization: `JWT ${token}`} })
      .then(() => {
        console.log("Like successful");
      }).catch((error) => {
        this.setState({
          liked: false,
          numLikes: (this.state.numLikes - 1),
        });
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

  addComment = () => {
    var updatedComments = this.state.comments.concat(this.state.commentText);
    this.setState({
      liked: true,
      numLikes: (this.state.numLikes + 1),
      comments: updatedComments,
    });
    const token = localStorage.getItem('JWT');
    axios.post(`/api/stories/${this.props._id}/comment`, {text: this.state.commentText},
     { headers: { Authorization: `JWT ${token}`} })
      .then(() => {
        console.log("Comment successful");
      }).catch((error) => {
        this.setState({
          liked: false,
          numLikes: (this.state.numLikes - 1),
        });
      });
  }

  handleChange = (event) => {
    this.setState({commentText: event.target.value});
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
      numLikes,
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
            <p className="story-likes">{this.state.numLikes}</p>
          </div>
          <div className="story-info">
            <div className="story-caption">
              {text}
            </div>
          </div>
          <div className="comments">
            {this.state.comments.map(comment => 
              <p>{comment.text}</p>
            )}
          </div>
          <div className="comment-container">
              <TextField
                id="comment"
                className="comment-box"
                placeholder="Comment"
                margin="normal"
                onChange={this.handleChange}
              />
            <button className="comment-post-btn" onClick={this.addComment}>
              Post
            </button>
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
            <p className="story-likes">{this.state.numLikes}</p>
          </div>
          <div className="story-info">
            <div className="story-caption">
              {text}
            </div>
          </div>
          <div className="comments">
            {this.state.comments.map(comment => 
              <p>{comment.text}</p>
            )}
          </div>
          <div className="comment-container">
              <TextField
              id="comment"
              className="comment-box"
              placeholder="Comment"
              margin="normal"
              onChange={this.handleChange}
            />
            <button className="comment-post-btn" onClick={this.addComment}>
              Post
            </button>
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
            <p className="story-likes">{this.state.numLikes}</p>
          </div>
          <div className="story-info">
            <div className="story-caption">
              {text}
            </div>
          </div>
          <div className="comments">
            {this.state.comments.map(comment => 
              <p>{comment.text}</p>
            )}
          </div>
          <div className="comment-container">
              <TextField
              id="comment"
              className="comment-box"
              placeholder="Comment"
              margin="normal"
              onChange={this.handleChange}
            />
            <button className="comment-post-btn" onClick={this.addComment}>
              Post
            </button>
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
