import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from './';
import { ActivityIndicator, View, Text } from 'react-native';
import styles from './styles';
import { getAnonymousToken } from './api';
import appConfig from '../appConfig.js';

class AnonymousBearer extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        if (this.props.token) {
            return this.props.children;
        } else {
            this.props.setToken(appConfig.token);
            // getAnonymousToken(config.username, config.password)
            //     .then((data) => {
            //         console.log(data);
            //         this.setState({ error: null });
            //         this.props.setId(data.id);
            //         this.props.setToken(data.token);
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //         this.setState({ error: error.message || error.error })
            //     });
            return (
                <View style={styles.flex}>
                    {this.state.error ?
                        (<View style={styles.error}>
                            <Text style={{ color: 'red' }}>
                                {this.state.error}
                            </Text>
                        </View>)
                        :
                        <ActivityIndicator />
                    }
                </View>
            );
        }
    }
}

export default connect((state) => {
    return {
        token: state.auth.token
    };
}, (dispatch) => {
    return {
        setToken: (token) => dispatch({
            type: 'SET_TOKEN',
            payload: token
        }),
        setId: (id) => dispatch({
            type: 'SET_ID',
            payload: id
        }),
    }
})(AnonymousBearer);