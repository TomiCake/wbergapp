import React, { Component } from 'react';
import styles from './styles';
import PropTypes from 'prop-types';
import { View, Text, ActivityIndicator, Animated } from 'react-native';
import moment from 'moment';
import Grid from './Grid';
import GridAlignedBox from './GridAlignedBox.animated';
import Period from './Period';
import { PERIOD_NUMBERS, WEEKDAY_NAMES, PERIOD_BGCOLOR, HOLIDAY_BGCOLOR } from '../../const';
import Swiper from './Swiper';

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
        this.timetableStore = {

        }
    }

    componentWillReceiveProps(nextProps) {
        
    }

    async parse(week, year) {
        if (this.timetableStore[week + "" + year]) return this.timetableStore[week + "" + year];
        let props = await this.props.loadFor(week, year);
        let data = [];
        for (x = 0; x < WEEKDAY_NAMES.length; x++) {
            let day = this.readTimetable(props.timetable, x);
            if (props.substitutions) {
                this.joinSubstitutions(day, props.substitutions[x + 1]);
            }
            this.skipDuplications(day);
            this.translatePeriods(this.props.masterdata, day);
            data[x] = day;
        }
        this.timetableStore[week + "" + year] = data;
        return data;
    }

    readTimetable(_data, day) {
        let data = [];
        for (y = 0; y < PERIOD_NUMBERS.length; y++) {
            let lessons = _data[day + 1][y + 1];
            if (lessons) {
                lessons = [...lessons];
            }
            data[y] = { lessons };
        }
        return { periods: data };
    }

    joinSubstitutions(day, subOnDay) {
        if (!subOnDay) return;
        if (subOnDay.holiday) {
            day.holiday = subOnDay.holiday;
            day.periods = undefined;
        } else if (subOnDay.substitutions && day.periods) {

            subOnDay.substitutions.forEach((substitution) => {
                let period = day.periods[substitution.PERIOD - 1];
                if (!period) return;
                let lessons = period.lessons;
                if (lessons) {
                    for (i = 0; i < lessons.length; i++) {
                        let lesson = lessons[i];
                        if (lesson.TIMETABLE_ID === substitution.TIMETABLE_ID) {
                            lessons[i] = {
                                substitutionType: substitution.TYPE,
                                CLASS_IDS: [],
                                TEACHER_ID: substitution.TEACHER_ID_NEW || lesson.TEACHER_ID,
                                SUBJECT_ID: substitution.SUBJECT_ID_NEW || lesson.SUBJECT_ID,
                                ROOM_ID: substitution.ROOM_ID_NEW || lesson.ROOM_ID,
                            };
                            break;
                        }
                    }
                }
                if (substitution.TIMETABLE_ID === null) {
                    if (!lessons) {
                        period.lessons = lessons = [];
                    }
                    lessons.push({
                        substitutionType: substitution.TYPE,
                        CLASS_IDS: [],
                        TEACHER_ID: substitution.TEACHER_ID_NEW,
                        SUBJECT_ID: substitution.SUBJECT_ID_NEW,
                        ROOM_ID: substitution.ROOM_ID_NEW,
                    });
                }
            });
        }

    }

    skipDuplications(day) {
        if (day.holiday) {
            return;
        }
        for (y = 0; y < PERIOD_NUMBERS.length; y++) {
            let current = day.periods[y];
            current.skip = 0;
            while (y + 1 < PERIOD_NUMBERS.length
                && this.comparePeriod(current.lessons, day.periods[y + 1].lessons)) {
                y++;
                delete day.periods[y];
                current.skip++;
            }
        }
    }

    translatePeriods(masterdata, day) {
        if (day.holiday) {
            return day;
        }
        for (y = 0; y < PERIOD_NUMBERS.length; y++) {
            if (day.periods[y] && day.periods[y].lessons) {
                this.translate(masterdata, day.periods[y]);
            }
        }
    }

    translate(masterdata, period) {
        if (!period) return period;
        period.lessons = period.lessons.map((period) => ({
            period,
            substitutionType: period.substitutionType,
            teacher: masterdata.Teacher[period.TEACHER_ID],
            subject: masterdata.Subject[period.SUBJECT_ID],
            room: masterdata.Room[period.ROOM_ID],
            classes: period.CLASS_IDS.map((c) => masterdata.Class[c].NAME),
        }));
        return period;
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
                    renderContent={(horizontal, toggledAnimation) =>
                        <Period
                            type={this.props.type}
                            data={period.lessons}
                            horizontal={horizontal}
                        />
                    }
                />
            );
        }
        return periodComponents;
    }

    calculateCellPositions(layout) {
        const screenWidth = layout.width;
        const screenHeight = layout.height;

        let height = screenHeight / PERIOD_NUMBERS.length;
        let width = screenWidth / WEEKDAY_NAMES.length;
        this.state.cellPositions = [[], [], [], [], []];

        for (x = 0; x < WEEKDAY_NAMES.length; x++) {
            for (y = 0; y < PERIOD_NUMBERS.length; y++) {
                this.state.cellPositions[x][y] = { width, height, left: width * x, top: height * y };
            }
        }
        this.onCellLayouts.forEach((fn) => fn(this.state.cellPositions));
        this.onCellLayouts = [];
        this.refs.grid.updateCellPositions();
    }
    onDataReceiveds = [];
    onCellLayouts = [];


    renderWeek = async (i) => {
        let date = this.props.date.clone().add(i, 'week');
        let data = await this.parse(date.week(), date.year());
        let cellPositions = await new Promise((resolve) => {
            if (this.state.cellPositions) {
                resolve(this.state.cellPositions);
            } else {
                this.onCellLayouts.push(resolve);
            }
        });
        let components = [];
        for (let x = 0; x < WEEKDAY_NAMES.length; x++) {
            let day = data[x];
            if (day.holiday) {
                components.push(
                    <GridAlignedBox
                        key={"holiday" + x}
                        skip={PERIOD_NUMBERS.length - 1}
                        backgroundColor={HOLIDAY_BGCOLOR}
                        boundingBox={cellPositions[x][0]}
                        contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center' }}
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
            <View style={[styles.container, this.props.style]}>
                <View style={styles.container}>
                    <Grid
                        ref="grid"
                        monday={moment().isoWeekday(1)}
                        onLayout={(layout) => this.calculateCellPositions(layout.nativeEvent.layout)}
                        renderWeek={
                            (i) => this.renderWeek(i)
                        }
                    >
                    </Grid>
                </View>
            </View>
        );
    }
}