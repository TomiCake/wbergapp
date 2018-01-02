import React, { Component } from 'react';
import styles from './styles';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import GridA from './GridA';
import Lesson from './Lesson';
import AppBar from './AppBar';

export default class Timetable extends Component {
    static propTypes = {
        type: PropTypes.string,
        data: PropTypes.object,
        masterdata: PropTypes.object,
    }
    renderLesson = (p, day) => {
        const timetable = this.props.data;
        const masterdata = this.props.masterdata;

        let periods = timetable[day][p];
        if (!periods) return;
        periods = periods.map((period) => ({
            teacher: masterdata.Teacher[period.TEACHER_ID],
            subject: masterdata.Subject[period.SUBJECT_ID],
            room: masterdata.Room[period.ROOM_ID],
            classes: period.CLASS_IDS.map((c) => masterdata.Class[c].NAME),
        }));
        return this.renderLessonView(periods);
    }

    renderLessonView(periods) {
        return (
            <View style={{ flex: 1 }}>
                <Text>{periods[0].teacher.NAME}</Text>

            </View>
        );
    }

    onCellLayout(cellPositions) {
        console.log(cellPositions);

    }

    render() {
        return (
            <View style={styles.container}>
                <AppBar />
                <View style={styles.container}>
                    <GridA onCellLayout={this.onCellLayout} />
                    <View>
                        <Lesson />
                    </View>
                </View>
            </View>
        );
    }
}