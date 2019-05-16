import React from 'react';

import './index.css';
import Layout from '../../components/Layout';

class DiscoverPage extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        return(
            <Layout title="Event page">
                <h1>This is the discover page</h1>
            </Layout>
        );
    }
}

export default DiscoverPage;