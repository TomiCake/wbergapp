import React, { Component } from 'react';

import { View, Text, ScrollView, Animated, TouchableWithoutFeedback, TouchableOpacity, TouchableNativeFeedback, TouchableHighlight, Dimensions } from 'react-native';
import styles from './period.styles';

export default class Period extends Component {


    renderLesson(type, lesson, i, horizontal, small) {

        if (type == "student") {
            var field1 = lesson.subject;
            var field2 = lesson.teacher;
            var field3 = lesson.room;
        }

        if (!horizontal && small) {
            return (
                <View key={i} style={styles.row}>
                    <Text style={[styles.text, styles.bold]} numberOfLines={1}>{field1.NAME}</Text>
                    <View>
                        <Text style={[styles.text, styles.small, styles.right]}>{field2.NAME}</Text>
                        <Text style={[styles.text, styles.small, styles.right]}>{field3.NAME}</Text>
                    </View>
                </View>)
        }
        if (!horizontal && !small) {
            return (
                <View key={i} style={styles.column}>
                    <View style={[styles.row, { flex: 1 }]}>
                        <View style={{ overflow: 'hidden' }}>
                            <Text style={[styles.text, styles.bold]} numberOfLines={1} >{field1.NAME}</Text>
                        </View>
                        <Text style={[styles.text, styles.right]}>{field3.NAME}</Text>
                    </View>
                    <Text style={[styles.text, styles.middle]} numberOfLines={1}>{field2.DESCRIPTION}</Text>
                </View>)
        }
        if (horizontal) {
            return (
                <View key={i} style={styles.row}>
                    <View style={[styles.column, styles.flex]}>
                        <Text style={[styles.text, styles.bold]} numberOfLines={1} ellipsizeMode="middle">{field1.DESCRIPTION}</Text>
                        <Text style={[styles.text, styles.small]}>{field2.DESCRIPTION}</Text>
                    </View>
                    <View>
                        <Text style={[styles.text, styles.right]}>{field3.NAME}</Text>
                    </View>
                </View>
                )
        }
    }

    constructor(props) {
        super(props);

    }

    render() {
 
        return (
            <View>
                {this.props.data.map((lesson, i) => (
                    this.renderLesson(this.props.type, lesson, i, this.props.horizontal, this.props.data.length > 1)
                ))}
            </View>
        );
    }
}