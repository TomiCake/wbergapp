import React, { Component } from 'react';
import styles from './styles';
import { View, Text } from 'react-native';
import { WEEKDAY_NAMES } from '../const';

export default class Header extends Component {
    render() {
        return (
            <View style={[styles.header, styles.row]}>
                <View style={styles.flex}>
                    <Text style={styles.dateText}>{WEEKDAY_NAMES[this.props.date.isoWeekday()-1] + this.props.date.format(", DD.MM.YYYY")}</Text>
                </View>
                <View style={styles.flex}>
                    <Text style={styles.headerText}>Wolkenberg-Gymnasium</Text>
                </View>
            </View>
        );
    }
}