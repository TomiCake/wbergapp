import React, { Component } from 'react';

import { View, ScrollView, Animated } from 'react-native';
import styles from './GridBox.styles';

export default function GridBox(props) {
    return (
        <Animated.ScrollView
            style={[styles.container, {backgroundColor: props.backgroundColor, opacity: props.opacity}]}
            contentContainerStyle={styles.contentContainer}>
            <View style={props.contentContainerStyle}>
                {props.renderContent(props.horizontal)}
            </View>
        </Animated.ScrollView>
    );
}