
import React, { Component } from 'react';
import styles from './appBar.styles';

import { View, Text } from 'react-native';


export default class AppBar extends Component {

    render() {
        return (
            <View style={styles.appBar}>
                <Text style={styles.title}>Wolkenberg</Text>
            </View>
        );
    }
}