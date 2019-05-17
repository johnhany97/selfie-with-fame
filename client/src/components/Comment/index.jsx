import React from 'react';
import axios from 'axios';
import './index.css';


class Comment extends React.Component {
    constructor(props){
        super(props);

    }

    render(){
        const {postedBy, text} = this.props;
        return(
            <p></p>
        );
    }
}

export default Comment;