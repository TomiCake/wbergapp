import React, { Component } from 'react';

import { View, Text, ScrollView, Animated, TouchableWithoutFeedback, TouchableOpacity, TouchableNativeFeedback, TouchableHighlight, Dimensions } from 'react-native';
import styles from './period.styles';

const templates = {
    "student": ["subject", "teacher", "room"],
    "class": ["subject", "teacher", "room"],
    "room": ["subject", "teacher", "classes"],
    "teacher": ["subject", "classes", "room"]
};

function PeriodText(props) {
    let textStyles = [styles.text, props.style];
    let textProps = { ellipsizeMode: props.ellipsizeMode };
    if (props.nowrap) {
        textProps.numberOfLines = 1;
    }
    Object.keys(props).forEach((e) => {
        switch (e) {
            case "bold":
            case "middle":
            case "small":
            case "right": textStyles.push(styles[e]);
        }
    });

    return (
        <Text style={textStyles} {...textProps} >{props.children}</Text>
    );
}


function renderLesson(type, lesson, i, horizontal, small) {
    Object.keys(lesson).forEach((key) => {
        if (typeof lesson[key] === 'object') {
            lesson[key] = { ...lesson[key] }
        }
    });
    let fields = templates[type].map((key) => lesson[key]);
    fields = fields.map((elem) => {
        if (!elem) {
            return { NAME: "???", DESCRIPTION: "???" };
        }
        if (elem instanceof Array) {
            let joined = elem.map((e) => e.NAME).join('|');
            return { NAME: joined, DESCRIPTION: joined };
        }
        return elem;
    });
    switch (lesson.substitutionType) {
        case "SUBSTITUTION": fields.forEach((e) => e.style = { color: 'red' }); break;
        case "ASSIGNMENT": fields.forEach((e) => e.style = { color: 'yellow' }); break;
        case "ROOM_SUBSTITUTION": lesson.room.style = { color: 'cyan' }; break;
        case "EXTRA_LESSON": fields.forEach((e) => e.style = { color: 'red' }); break;
        case "ELIMINATION": fields.forEach((e) => e.style = {color: 'green'}); break;    
    }



    if (!horizontal && small) {
        return (
            <View key={i} style={styles.row}>
                <PeriodText style={fields[0].style} bold nowrap>{fields[0].NAME}</PeriodText>
                <View>
                    <PeriodText style={fields[1].style} small right>{fields[1].NAME}</PeriodText>
                    <PeriodText style={fields[2].style} small right>{fields[2].NAME}</PeriodText>
                </View>
            </View>
        );
    }
    if (!horizontal && !small) {
        return (
            <View key={i} style={styles.column}>
                <View style={[styles.row, styles.flex]}>
                    <PeriodText style={fields[0].style} bold nowrap >{fields[0].NAME}</PeriodText>
                    <PeriodText style={fields[2].style} right>{fields[2].NAME}</PeriodText>
                </View>
                <PeriodText style={fields[1].style} nowrap middle>{fields[1].DESCRIPTION}</PeriodText>
            </View>
        );
    }
    if (horizontal) {
        return (
            <View key={i} style={styles.row}>
                <View style={[styles.column, styles.flex]}>
                    <PeriodText style={fields[0].style} nowrap bold ellipsizeMode="middle">{fields[0].DESCRIPTION}</PeriodText>
                    <PeriodText style={fields[1].style} small>{fields[1].DESCRIPTION}</PeriodText>
                </View>
                <View>
                    <PeriodText style={fields[2].style} right>{fields[2].NAME}</PeriodText>
                </View>
            </View>
        );
    }
}
export default (props) => (
    <View style={{ flex: 1 }}>
        {props.data.map((lesson, i) => (
            renderLesson(props.type, lesson, i, props.horizontal, props.data.length > 1)
        ))}
    </View>
)