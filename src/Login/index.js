import React, { Component } from 'react'
import {
    View,
    Text,
    Image,
    TextInput,
    StatusBar,
    AsyncStorage,
    Animated,
    Easing,
    Keyboard,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    ScrollView,
    ActivityIndicator,
    Platform
} from 'react-native';

import { Bar } from 'react-native-progress';

import { connect } from 'react-redux';
import styles from './styles';
import { getToken } from './api';
import Button from '../components/Button';

export class LoginScreen extends Component {

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
            <View style={styles.flex}>
                <View style={styles.backgroundContainer}>
                    <Animated.Image
                        source={require('../../img/bg.jpg')}
                        style={styles.backgroundImage}
                    >
                    </Animated.Image>
                </View>
                <View style={[styles.container]}>
                    <View
                        style={[styles.card]}>
                        <Bar
                            borderRadius={0}
                            width={null}
                            unfilledColor="#FEFEFE"
                            color="#4CAF50"
                            height={3}
                            useNativeDriver={true}
                            indeterminate={this.state.loggingIn}
                            borderWidth={0}
                        />
                        <View style={styles.cardHeader}>
                            <Text style={{ fontSize: 24 }}>
                                Anmeldung
                                </Text>
                            <Image
                                source={require('../../img/logo.png')}
                                resizeMode="contain"
                                style={{ height: 35, width: '100%', marginBottom: 15 }}>

                            </Image>
                        </View>
                        <View style={[styles.cardContent]}>
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, styles.flex]}
                                    placeholder="E-Mail"
                                    returnKeyType="next"
                                    tabIndex={1}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    blurOnSubmit={false}
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
                                blurOnSubmit={false}
                                tabIndex={2}
                                secureTextEntry
                                value={this.state.password}
                                onFocus={() => this.setState({ error: null })}
                                ref="passwordInput"
                                onSubmitEditing={this.login.bind(this)}
                                onChangeText={(text) => this.setState({ password: text })}
                            />
                            <Button
                                onPress={this.login.bind(this)}
                                title="Login"
                                color="#3F51B5"
                                disabled={this.state.loggingIn}
                            >
                            </Button>
                            <View style={styles.error}>
                                <Text style={{ color: 'red' }}>
                                    {this.state.error || ""}
                                </Text>
                            </View>
                        </View>
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
