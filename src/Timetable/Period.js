import React, { Component } from 'react';

import { View, Text, ScrollView } from 'react-native';
import styles from './period.styles';

const LONG = {
    key: 'DESCRIPTION',
    size: 8,
    bold: true
};
const long = {
    key: 'DESCRIPTION',
    size: 8,
    bold: false
};
const short = {
    key: 'NAME',
    size: 8,
    bold: false
};
const SHORT = {
    key: 'NAME',
    size: 8,
    bold: true
};
const small = {
    key: 'NAME',
    size: 6,
    bold: false
};
const templates = {
    student: {
        horizontal: {
            "subject": short,
            "teacher": short,
            "room": short
        },
        vertical: {
            "subject": short,
            "teacher": long,
            "room": short
        },
    }
}

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
                    <Text style={[styles.text, styles.bold]}>{field1.NAME}</Text>
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
                        <Text style={[styles.text, styles.bold]}>{field1.NAME}</Text>
                        <Text style={[styles.text, styles.right]}>{field3.NAME}</Text>    
                    </View>
                    <Text style={[styles.text, styles.middle]} numberOfLines={1}>{field2.DESCRIPTION}</Text>
                </View>)
        } 
        if (horizontal) {
            return (
                <View key={i} style={styles.row}>
                    <View style={styles.column}>
                        <Text style={[styles.text, styles.bold]}>{field1.DESCRIPTION}</Text>
                        <Text style={[styles.text, styles.small]}>{field2.DESCRIPTION}</Text>
                    </View>
                    <Text style={[styles.text, styles.right]}>{field3.NAME}</Text>
                </View>)
        }     
    }

    render() {
        const data = this.props.data;
        const horizontal = this.props.boundingBox.width > this.props.boundingBox.height * 1.5;
        let height = this.props.boundingBox.height * (this.props.skip + 1) + this.props.skip;
        const margin = 2;
        this.props.boundingBox.top += margin;
        this.props.boundingBox.left += margin;
        this.props.boundingBox.width -= 2*margin;
        height -= 2*margin;
        return (
            <ScrollView style={[this.props.boundingBox, styles.container, { height: height, backgroundColor: this.props.backgroundColor }]}
                contentContainerStyle={styles.contentContainer}>
                {data.map((lesson, i) => (
                    this.renderLesson(this.props.type, lesson, i, horizontal, data.length > 1)
                ))}

            </ScrollView>
        );
    }
}