import React, { Component } from 'react';
import styles from './appBar.styles';

import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import Icon from '../components/Icon';
import { Bar } from 'react-native-progress';

const Key = (props) => (
    <TouchableOpacity style={styles.key} onPress={props.onPress}>
        <Text style={styles.keyText}>
            {props.name}
        </Text>
    </TouchableOpacity>
);

export default class AppBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            textValue: "",
        }
    }

    reset() {
        this.refs.textInput.clear();
        this.setState({ textValue: "" });
        this.props.onChangeText("");

    }

    componentDidMount() {
        if (!this.props.public) {
            this.refs.textInput.focus();
        }
    }

    async onKeyPress(key) {
        let text = this.state.textValue + key;
        this.setState({ textValue: text });
        this.props.onChangeText(text);
    }

    render() {
        return (
            <View>
                <View style={styles.appBar}>
                    <Icon
                        iconStyle={styles.button}
                        name='chevron-left'
                        color="white"
                        onPress={() => this.props.goBack()} />
                    <TextInput
                        style={styles.textInput}
                        value={this.props.public && this.state.textValue}
                        underlineColorAndroid='white'
                        selectionColor='white'
                        ref="textInput"
                        editable={!this.props.public}
                        onChangeText={this.props.onChangeText} />
                    <Icon
                        iconStyle={styles.button}
                        name='backspace'
                        color="white"
                        onPress={() => this.reset()} />
                </View>
                {this.props.public &&
                    <View style={styles.keyboard}>
                        <View style={styles.keyboardRow}>
                            {"0123456789".split('').map((name, i) => (
                                <Key key={i} onPress={this.onKeyPress.bind(this, name)} name={name} />
                            ))}
                        </View>
                        <View style={styles.keyboardRow}>
                            {"QWERTZUIOP".split('').map((name, i) => (
                                <Key key={i} onPress={this.onKeyPress.bind(this, name)} name={name} />
                            ))}
                        </View>
                        <View style={styles.keyboardRow}>
                            {"ASDFGHJKL".split('').map((name, i) => (
                                <Key key={i} onPress={this.onKeyPress.bind(this, name)} name={name} />
                            ))}
                        </View>
                        <View style={styles.keyboardRow}>
                            {"YXCVBNM".split('').map((name, i) => (
                                <Key key={i} onPress={this.onKeyPress.bind(this, name)} name={name} />
                            ))}
                        </View>
                    </View>
                }    
            </View>
        );
    }
}