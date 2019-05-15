/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import userProfilePlaceholder from '../../../images/event-img-placeholder.jpg';
import heartOutline from './heart-outline.png';
import StoryStepper from '../../StoryStepper';

class Story extends React.Component {
  constructor(props) {
    super(props);
  }

  convertDateFormat(date){
    let createAtDate = new Date(date);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
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
    } = this.props;

    let picBuffers = [];
    if (pictures) {
      for(let i = 0; i < pictures.length; i++){
        picBuffers.push(new Buffer(pictures[i]).toString('base64'));
      }
    }
    console.log(picBuffers);

    return (
      <div className="story-container">
        <div className="story-header">
          <img className="story-user-profile" src={userProfilePlaceholder} alt="User profile" />
          <h4 className="story-username">{postedBy.username}</h4>
          <p className="story-date">{this.convertDateFormat(createdAt)}</p>
        </div>
        {picBuffers && (<StoryStepper pictures={picBuffers} />)}
        <div className="story-btns">
          <img className="heart-story-btn" src={heartOutline} alt="Heart Story button"/>
          <p className="story-likes">13</p>
        </div>
        <div className="story-info">
          <div className="story-caption">
            {text}
          </div>
        </div>
      </div>
    );
  }
};
/**
 * {picture && (
          <React.Fragment>
            <img className="story-img" src={`data:image/jpeg;base64,${picBuffer}`} alt="Story pic" />
          </React.Fragment>
        )}
 */

Story.propTypes = {
  text: PropTypes.string,
  picture: PropTypes.any,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
};

export default Story;
