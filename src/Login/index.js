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
import { login } from './actions';

export class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
        };
    }


    login() {
        Keyboard.dismiss(); // Dismissing manually
        this.props.login(this.state.email, this.state.password);
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
                            indeterminate={this.props.loading}
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
                                disabled={this.props.loading}
                            >
                            </Button>
                            <View style={styles.error}>
                                <Text style={{ color: 'red' }}>
                                    {this.props.error && this.props.error.error || this.props.error}
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
        username: state.auth.username,
        loading: state.auth.loading,
        error: state.auth.error
    }
}, (dispatch) => {
    return {
        login: (username, password) => dispatch(login(username, password)),
    }
})(LoginScreen);
