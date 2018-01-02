import React, { Component } from 'react';
import styles from './styles';
import PropTypes from 'prop-types';
import { View, Text, ActivityIndicator } from 'react-native';
import moment from 'moment';
import Grid from './Grid';
import Period from './Period';
import AppBar from './AppBar';
import { PERIOD_NUMBERS, WEEKDAY_NAMES } from '../../const';

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
        const timetable = this.props.data;


        for (x = 0; x < WEEKDAY_NAMES.length; x++) {
            data[x] = [];
            for (y = 0; y < PERIOD_NUMBERS.length; y++) {
                current = timetable[x + 1][y + 1];
                let c = data[x][y] = { lessons: this.translate(current), skip: 0 };
                while (y < PERIOD_NUMBERS.length && this.comparePeriod(current, timetable[x + 1][y + 2])) {
                    c.skip++;
                    y++;
                }
            }
        }
        this.state.data = data;
    }

    translate = (lessons) => {
        const masterdata = this.props.masterdata;
        if (!lessons) return lessons;
        lessons = lessons.map((period) => ({
            teacher: masterdata.Teacher[period.TEACHER_ID],
            subject: masterdata.Subject[period.SUBJECT_ID],
            room: masterdata.Room[period.ROOM_ID],
            classes: period.CLASS_IDS.map((c) => masterdata.Class[c].NAME),
        }));
        return lessons;
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


    render() {
        const cellPositions = this.state.cellPositions;
        console.log(cellPositions);

        let periods = [];
        if (cellPositions) {
            for (x = 0; x < WEEKDAY_NAMES.length; x++) {
                for (y = 0; y < PERIOD_NUMBERS.length; y++) {
                    let data = this.state.data[x][y];
                    if (!data || !data.lessons) continue;
                    periods.push(
                        <Period
                            data={data.lessons}
                            key={x * 10 + y}
                            skip={data.skip}
                            type={this.props.type}
                            backgroundColor="#3e2723"
                            boundingBox={cellPositions[x][y]} />
                    );
                }
            }
        }

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
                        {cellPositions ?
                            periods
                            :
                            <ActivityIndicator size={80} />
                        }
                    </View>

                </View>
            </View>
        );
    }
}