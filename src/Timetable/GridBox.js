import React, { Component } from 'react';

import { View, ScrollView } from 'react-native';
import styles from './GridBox.styles';

export default function GridBox(props) {
    return (
        <ScrollView
            style={[styles.container, {backgroundColor: props.backgroundColor}]}
            contentContainerStyle={styles.contentContainer}>
            <View style={props.contentContainerStyle}>
                {props.renderContent(props.horizontal)}
            </View>
        </ScrollView>
    );
}