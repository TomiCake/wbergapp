import React, { Component } from 'react';
import styles from './styles';
import PropTypes from 'prop-types';
import { View, Text, ActivityIndicator } from 'react-native';
import moment from 'moment';
import Grid from './Grid';
import GridAlignedBox from './GridAlignedBox';
import Period from './Period';
import AppBar from './AppBar';
import { PERIOD_NUMBERS, WEEKDAY_NAMES, PERIOD_BGCOLOR, HOLIDAY_BGCOLOR } from '../../const';

export default class Timetable extends Component {
    static propTypes = {
        type: PropTypes.string,
        data: PropTypes.object,
        masterdata: PropTypes.object,
    }
    constructor(props) {
        super(props);
        this.state = {

        };
        let data = [];

        for (x = 0; x < WEEKDAY_NAMES.length; x++) {
            let day = this.readTimetable(x);
            this.joinSubstitutions(day, this.props.substitutions[x + 1]);
            this.skipDuplications(day);
            this.translatePeriods(day);
            data[x] = day;
        }

        this.state.data = data;
    }

    readTimetable(day) {
        let data = [];
        for (y = 0; y < PERIOD_NUMBERS.length; y++) {
            data[y] = { lessons: this.props.data[day + 1][y + 1] };
        }
        return { periods: data };
    }

    joinSubstitutions(day, subOnDay) {
        if (subOnDay.holiday) {
            day.holiday = subOnDay.holiday;
            day.periods = undefined;
        }
        for (y = 0; y < PERIOD_NUMBERS.length; y++) {
        }
    }

    skipDuplications(day) {
        if (day.holiday) {
            return day;
        }
        for (y = 0; y < PERIOD_NUMBERS.length; y++) {
            let current = day.periods[y];
            current.skip = 0;
            while (y + 1 < PERIOD_NUMBERS.length && this.comparePeriod(current.lessons, day.periods[y + 1].lessons)) {
                y++;
                delete day.periods[y];
                current.skip++;
            }
        }
    }

    translatePeriods(day) {
        if (day.holiday) {
            return day;
        }
        for (y = 0; y < PERIOD_NUMBERS.length; y++) {
            if (day.periods[y] && day.periods[y].lessons) {
                this.translate(day.periods[y]);
            }
        }
    }


    translate(period) {
        if (!period) return period;
        const masterdata = this.props.masterdata;
        period.lessons = period.lessons.map((period) => ({
            teacher: masterdata.Teacher[period.TEACHER_ID],
            subject: masterdata.Subject[period.SUBJECT_ID],
            room: masterdata.Room[period.ROOM_ID],
            classes: period.CLASS_IDS.map((c) => masterdata.Class[c].NAME),
        }));
        return period;
    }

    onCellLayout = (cellPositions) => {
        this.setState({ cellPositions });

    }

    comparePeriod(current, next) {
        if (!next || !current) return false;
        if (current.length != next.length) return false;
        next = [...next];
        for (i = 0; i < current.length; i++) {
            for (j = 0; j < next.length; j++) {
                if (this.compareLesson(current[i], next[j])) {
                    next.splice(j);
                    break;
                }
            }
        }
        return next.length == 0;
    }
    compareLesson(p1, p2) {
        if (p1.TEACHER_ID !== p2.TEACHER_ID
            || p1.SUBJECT_ID !== p2.SUBJECT_ID
            || p1.ROOM_ID !== p2.ROOM_ID)
            return false;

        if (!(p1.CLASS_IDS.length == p2.CLASS_IDS.length
            && p1.CLASS_IDS.every((v, i) => p2.CLASS_IDS.indexOf(v) >= 0)))
            return false;
        return true;
    }

    renderPeriods(day, periods) {
        const cellPositions = this.state.cellPositions;
        let periodComponents = [];
        for (y = 0; y < PERIOD_NUMBERS.length; y++) {
            let period = periods[y];
            if (!period || !period.lessons) continue;
            periodComponents.push(
                <GridAlignedBox
                    expandable
                    key={day * 10 + y}
                    skip={period.skip}
                    backgroundColor={PERIOD_BGCOLOR}
                    boundingBox={cellPositions[day][y]}
                    renderContent={(horizontal) => <Period
                        type={this.props.type}
                        data={period.lessons}
                        horizontal={horizontal} />} />
            );
        }
        return periodComponents;
    }

    renderWeek = (timetable) => {
        let components = [];
        const cellPositions = this.state.cellPositions;
        for (x = 0; x < WEEKDAY_NAMES.length; x++) {
            let day = this.state.data[x];
            if (day.holiday) {
                components.push(
                    <GridAlignedBox
                        key={x}
                        skip={PERIOD_NUMBERS.length - 1}
                        backgroundColor={HOLIDAY_BGCOLOR}
                        boundingBox={cellPositions[x][0]}
                        contentContainerStyle={{flexDirection: 'column', justifyContent: 'center'}}
                        renderContent={(horizontal) => (
                                <Text style={styles.holiday}>{day.holiday}</Text>
                        )} />);
            }
            if (day.periods) {
                components.push(...this.renderPeriods(x, day.periods));
            }
        }
        return components;
    }

    render() {

        return (
            <View style={styles.container}>
                <AppBar />
                <View style={styles.container}
                    onLayout={() => {
                        this.onCellLayout(this.refs.grid.cellPositions);
                    }}
                >
                    <Grid
                        ref="grid"
                        monday={moment().isoWeekday(1)}
                    />

                    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
                        {this.state.cellPositions ?
                            this.renderWeek(this.state.data)
                            :
                            <ActivityIndicator size={80} />
                        }
                    </View>

                </View>
            </View>
        );
    }
}