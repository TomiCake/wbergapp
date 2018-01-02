import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    TextInput,
    Button,
    StatusBar,
    AsyncStorage,
    Animated,
    Easing,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ScrollView,
    ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';
import styles from './styles';
import { getToken } from './api';

import PropTypes from 'prop-types';

export class LoginScreen extends Component {

    static propTypes = {
        setToken: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.setState({ email: this.props.lastUsername });
    }


    constructor(props) {
        super(props);
        this.state = {
        };
    }


    login() {
        Keyboard.dismiss(); // Dismissing manually
        this.setState({ loggingIn: true });
        this.props.setLastUsername(this.state.email);
        getToken(this.state.email, this.state.password)
            .then((data) => {
                console.log(data);
                this.setState({ error: null, loggingIn: false });
                this.props.setId(data.id);
                this.props.setToken(data.token);
            })
            .catch((error) => {
                console.log(error);
                this.setState({ error: error.message || error.error, loggingIn: false })
            });
    }


    render() {

        return (
            <View style={{ flex: 1 }}>
                <Animated.Image
                    source={require('wbergapp/img/bg.jpg')}
                    style={styles.backgroundImage}
                    onPress={Keyboard.dismiss} >
                </Animated.Image>
                {/* Dismissing keyboard manually */}
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0

                }}
                    onPress={Keyboard.dismiss}>
                    <View
                        behavior="height"
                        style={styles.container}>
                        <TouchableWithoutFeedback
                            onPress={Keyboard.dismiss}>
                         <View
                                style={styles.card}>
                                <ScrollView>
                                    <View style={styles.cardHeader}>
                                        <Image
                                            source={require('wbergapp/img/logo.png')}
                                            resizeMode="contain"
                                            style={{ height: 80, marginBottom: 15 }}>

                                        </Image>
                                        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                                            Schön, dass Du diese App verwendest.
                                    </Text>
                                    </View>


                                    <View style={{ flexDirection: 'row' }}>
                                        <TextInput
                                            style={[styles.input, { flex: 1 }]}
                                            placeholder="email"
                                            returnKeyType="next"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            value={this.state.email}
                                            onFocus={() => this.setState({ error: null })}
                                            onSubmitEditing={() => this.refs.passwordInput.focus()}
                                            ref="emailInput"
                                            onChangeText={(text) => this.setState({ email: text })}
                                        />
                                        <Text style={{ marginTop: 10 }}>@wgmail.de</Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Passwort"
                                        returnKeyType="go"
                                        secureTextEntry
                                        onFocus={() => this.setState({ error: null })}
                                        ref="passwordInput"
                                        onSubmitEditing={this.login.bind(this)}
                                        onChangeText={(text) => this.setState({ password: text })}
                                    />

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flex: 1 }}>
                                            <Button
                                                onPress={this.login.bind(this)}
                                                title="Login"
                                                color="#3F51B5"
                                                disabled={this.state.loggingIn}
                                            />
                                        </View>
                                        {this.state.loggingIn &&
                                            <ActivityIndicator />}
                                    </View>

                                    {this.state.error ?
                                        (<View style={styles.error}>
                                            <Text style={{ color: 'red' }}>
                                                {this.state.error}
                                            </Text>
                                        </View>)
                                        : null
                                    }
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        );
    }

}

export default connect((state, ownProps) => {
    return {
        lastUsername: state.auth.lastUsername
    }
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
        setLastUsername: (username) => {
            return dispatch({
                type: 'SET_LAST_USERNAME',
                username
            })
        }
    }
})(LoginScreen);
