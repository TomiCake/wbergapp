import React, { Component } from 'react';
import styles from './appBar.styles';

import { View, TextInput, Text, Platform } from 'react-native';
import { Bar } from 'react-native-progress';
import Touchable from '../components/Touchable';
import Icon from '../components/Icon';

const Key = (props) => (
    <View style={styles.key}>
        <Touchable
            onPress={props.onPress}>
            <Text style={styles.keyText}>
                {props.name}
            </Text>
        </Touchable>
    </View>
);

export default class AppBar extends Component {

    constructor(props) {
        super(props);
        this.textValue = "";
    }

    reset() {
        this.textValue = "";
        this.refs.textInput.clear();
        this.props.onChangeText("");
    }

    backspace() {
        this.textValue = this.textValue.slice(0, -1);
        this.refs.textInput.setNativeProps({ text: this.textValue });
        this.props.onChangeText(this.textValue);

    }

    onKeyPress(key) {
        this.textValue = this.textValue + key;
        this.refs.textInput.setNativeProps({ text: this.textValue });
        this.props.onChangeText(this.textValue);
    }

    render() {
        return (
            <View>
                <View style={styles.appBar}>
                    <TextInput
                        style={styles.textInput}
                        underlineColorAndroid='white'
                        editable={false}
                        selectionColor='white'
                        ref="textInput" />
                    <Icon
                        iconStyle={styles.button}
                        name='backspace'
                        color="white"
                        onPress={() => this.backspace()}
                        onLongPress={() => this.reset()}
                    />
                </View>

                <View style={styles.keyboard}>
                    {["0123456789", "QWERTZUIOP", "ASDFGHJKL", "YXCVBNM"].map((row, j) => (
                        <View style={styles.keyboardRow} key={j}>
                            {row.split('').map((name, i) => (
                                <Key key={i} onPress={this.onKeyPress.bind(this, name)} name={name} />
                            ))}
                        </View>
                    ))}
                </View>

            </View>
        );
    }
}