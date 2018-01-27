import React, { Component } from 'react';
import styles from './appBar.styles';

import { View, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import { Bar } from 'react-native-progress';

export default class AppBar extends Component {

    reset() {
        this.refs.textInput.clear();
    }

    componentDidMount() {
        this.refs.textInput.focus();
    }

    render() {
        return (
            <View style={styles.appBar}>
                <Icon
                    iconStyle={styles.button}
                    name = 'chevron-left'
                    color = "white"
                    onPress={() => this.props.goBack()} />
                <TextInput 
                    style={styles.textInput}
                    underlineColorAndroid='white'
                    selectionColor='white' 
                    ref="textInput" 
                    onChangeText={this.props.onChangeText} />
                <Icon
                    iconStyle={styles.button}
                    name = 'backspace'
                    color = "white"
                    onPress={() => this.reset() } />
            </View>
        );
    }
}