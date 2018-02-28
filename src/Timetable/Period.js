import React, { Component } from 'react';

import { View, Text, ScrollView, Animated, TouchableWithoutFeedback, TouchableOpacity, TouchableNativeFeedback, TouchableHighlight, Dimensions } from 'react-native';
import styles from './period.styles';
import { SUBSTITUTION_MAP } from '../const';

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
        if (typeof lesson[key] === 'object' && !Array.isArray(lesson[key])) {
            lesson[key] = { ...lesson[key] }
        }
    });
    let fields = templates[type].map((key) => lesson[key]);
    fields = fields.map((elem) => {
        if (!elem) {
            return { NAME: "???", DESCRIPTION: "???" };
        }
        if (elem instanceof Array) {
            let joinedName = elem.map(e=> e.NAME).join(', ');
            let joinedDescription = elem.map(e => e.DESCRIPTION || e.NAME).join(', ');
            return { NAME: joinedName, DESCRIPTION: joinedDescription };
        }
        return elem;
    });
    let style = SUBSTITUTION_MAP[lesson.substitutionType];
    if (style) {
        if (style.targets) {
            style.targets.forEach((key) => {
                lesson[key].style = { color: style.color };
            })
        } else {
            fields.forEach((e) => e.style = { color: style.color });
        }
    }
    if (lesson.substitutionRemove) {
        fields.forEach((e) => e.style = {
            ...e.style,
            fontSize: 8,
            textDecorationLine: 'line-through',
            color: 'grey'
        });
    }

    let period;
    if (!horizontal && small) {
        period = (
            <View style={[styles.row]}>
                <PeriodText style={fields[0].style} bold nowrap>{fields[0].NAME}</PeriodText>
                <View style={[styles.column, styles.flex]}>
                    <PeriodText style={fields[1].style} small right nowrap>{fields[1].DESCRIPTION}</PeriodText>
                    <PeriodText style={fields[2].style} small right>{fields[2].NAME}</PeriodText>
                </View>
            </View>
        );
    } else if (!horizontal && !small) {
        period = (
            <View style={[styles.column]}>
                <View style={[styles.row, styles.flex]}>
                    <PeriodText style={fields[0].style} bold nowrap>{fields[0].NAME}</PeriodText>
                    <PeriodText style={fields[2].style} right>{fields[2].NAME}</PeriodText>
                </View>
                <PeriodText style={fields[1].style} middle>{fields[1].DESCRIPTION}</PeriodText>
            </View>
        );
    } else if (horizontal) {
        period = (
            <View style={styles.row}>
                <View style={[styles.column, styles.flex]}>
                    <PeriodText style={fields[0].style} nowrap bold ellipsizeMode="middle">{fields[0].DESCRIPTION}</PeriodText>
                    <PeriodText style={fields[1].style} small>{fields[1].DESCRIPTION}</PeriodText>
                </View>
                <PeriodText style={fields[2].style} right>{fields[2].NAME}</PeriodText>
            </View>
        );
    }
    return (
        <View key={i} style={[styles.column, styles.flex]}>
            {lesson.substitutionType &&
                <PeriodText style={{ color: style && style.color || 'white' }} bold>{lesson.substitutionText || style && style.type}</PeriodText>
            }
            {period}
        </View>
    )

}
export default (props) => (
    <View>
        {props.data.map((lesson, i) => (
            renderLesson(props.type, lesson, i, props.horizontal || props.opened, props.data.length > 1)
        ))}
    </View>
)