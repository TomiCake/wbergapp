

import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import lodash from 'lodash';


const layouts = {
    'student': ["subject", "teacher", "room"],
    'teacher': ["subject", "classes", "room"],
    'class': ["subject", "teacher", "room"],
    'room': ["classes", "teacher", "subject"]
}

export default class LessonView extends Component {



    renderItem(period, index, substStyle) {

        let layout = layouts['student'].slice();

        for (let i = 0; i < layout.length; i++) {
            let o = period[layout[i]];
            if (Array.isArray(o)) {
                layout[i] = o.join(",");
            } else
                layout[i] = o.NAME;
        }

        return (
            <View style={styles.lesson} key={index}>
                <Text style={[styles.lessonText, substStyle]}>
                    {layout[0]}
                </Text>
                <Text style={[styles.lessonText, substStyle]}>
                    {layout[1]}
                </Text>
                <Text style={[styles.lessonText, substStyle]}>
                    {layout[2]}
                </Text>
            </View>
        );
    }

    renderSubstitution(substitution, index, period) {
        return (
            <View style={{ flex: 1 }} key={index}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[styles.lessonText, { fontSize: this.props.size.medium }, { color: 'lime' }]}>{toHumanReadable(substitution.flags)}</Text>
                </View>
                {this.renderItem(period, index, { color: 'red' })}
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={[
                        styles.lessonText,
                        { fontSize: this.props.size.medium },
                        { color: 'lime' }]
                    }>{substitution.text}</Text>
                </View>
            </View>
        );
    }

    renderPeriod(period, index) {
        return (
            <View style={{ flex: 1 }} key={index}>
                {
                    period.substitutions && period.substitutions.length > 0 ?
                        period.substitutions.map(
                            (substitution, index) => this.renderSubstitution(substitution, index, period))
                        : this.renderItem(period, index)
                }
            </View>
        );
    }

    render() {
        let { periods, type } = this.props;

        return (
            <View style={{ flex: 1 }}>
                {periods &&
                    <View style={styles.lessonWrapper}>
                        {
                            periods ? periods.map(this.renderPeriod.bind(this)) : null
                        }
                    </View>
                }

            </View>
        );
    }
}

export class HolidayView extends Component {


    render() {
        return (
            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
                <Text style={[styles.holidayText, { fontSize: this.props.size.large }]}>{this.props.text}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    lesson: {

        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    lessonWrapper: {
        flex: 1,
        backgroundColor: '#1976d2',
        padding: 10,
        margin: 1,

    },
    lessonRight: {
        flex: 1,
        flexDirection: 'column'
    },
    lessonText: {
        color: 'white',
    },
    lessonTextRight: {
        color: 'white',
        textAlign: 'right',
    },
    holidayText: {
        color: 'green',
        textAlign: 'center'
    }

});

