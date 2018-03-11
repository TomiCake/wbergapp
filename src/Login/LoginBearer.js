import React, {Component} from 'react';
import { connect } from 'react-redux';
import Login from './';

class LoginBearer extends Component {

    render(){
        if(this.props.token){
            return this.props.children;
        } else {
            return <Login />;
        }
    }
}

export default connect((state) => {
    return {
        token: state.auth.token && state.auth.id
    };
})(LoginBearer);