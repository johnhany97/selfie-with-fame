/* eslint-disable */
import React from 'react';

import {
  noWidthBtn,
} from '../../styles/formStyles';
import './index.css';
import crossBtn from './../../images/cross.png';

const Photo = (props) => {
  const { handleSaveClick, data, index, removePicture, confirmation } = props;
  if(confirmation){
    return (
      <div className={"thumbnail-container " + (confirmation ? "confirmation-preview" : "")}>
        <img src={data} id="photo" className="create-story-img"/>
      </div>
    );
  } else{
    return (
      <div className="thumbnail-container">
        <img src={data} id="photo" className="create-story-img"/>
        <img src={crossBtn} alt="Remove Picture" className="remove-picture-btn" onClick={() => removePicture(index)}/>
      </div>
    );
  }
}

export default Photo;
