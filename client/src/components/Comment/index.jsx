import React from 'react';
import axios from 'axios';
import './index.css';


class Comment extends React.Component {
    constructor(props){
        super(props);

    }
    findUser = () => {
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

    render(){
        const {postedBy, text} = this.props;
        return(
            <p></p>
        );
    }
}

export default Comment;