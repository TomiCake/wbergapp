import React, { Component } from 'react';
import styles from './styles';
import { View, Text, ActivityIndicator, Animated, Platform } from 'react-native';
import moment from 'moment';
import Grid from './Grid';
import Period from './Period';
import { PERIOD_NUMBERS, WEEKDAY_NAMES, PERIOD_BGCOLOR, HOLIDAY_BGCOLOR } from '../const';
import Swiper from './Swiper';
import GridBox from './GridBox';
import Icon from '../components/Icon';

export default class Timetable extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.timetableStore = {

        };
    }
    componentDidUpdate(nextProps) {
        if (nextProps.masterdata && this.props.masterdata && this.props.masterdata.version !== nextProps.masterdata.version) {
            // clear timetable cache
            console.log("masterdata changed");
            this.timetableStore = {};
            this.refs.grid.updatePages();
            return;
        }
        if (nextProps.id !== this.props.id || nextProps.type !== this.props.type) {
            // clear timetable cache
            this.timetableStore = {};
            this.refs.grid.updatePages();
        }
        let diff = nextProps.date.diff(this.props.date, 'week');
        console.log(diff);
        if (diff !== 0) {
            // date changed
            this.refs.grid.updateDate(diff);
        }
    }

    async parse(week, year) {
        if (this.timetableStore[week + "" + year]) {
            return this.timetableStore[week + "" + year];
        }
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
            let lessons = (_data[day + 1] || [])[y + 1];
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
                        if (parseInt(lesson.TIMETABLE_ID) === substitution.TIMETABLE_ID) {
                            lessons[i] = {
                                substitutionRemove:
                                    this.props.type === 'room'
                                    && substitution.ROOM_ID === lesson.ROOM_ID
                                    && lesson.ROOM_ID !== substitution.ROOM_ID_NEW
                                    ||
                                    this.props.type === 'teacher'
                                    && substitution.TEACHER_ID === lesson.TEACHER_ID
                                    && substitution.TEACHER_ID_NEW !== lesson.TEACHER_ID,
                                substitutionType: substitution.TYPE,
                                substitutionText: substitution.TEXT,
                                CLASS_IDS: substitution.CLASS_IDS && substitution.CLASS_IDS.split(',') || lesson.CLASS_IDS,
                                TEACHER_ID: substitution.TEACHER_ID_NEW || lesson.TEACHER_ID,
                                SUBJECT_ID: substitution.SUBJECT_ID_NEW || lesson.SUBJECT_ID,
                                ROOM_ID: substitution.ROOM_ID_NEW || lesson.ROOM_ID,

                            };
                            return;
                        }
                    }
                }
                if (!lessons) {
                    period.lessons = lessons = [];
                }
                lessons.push({
                    substitutionText: substitution.TEXT,
                    substitutionRemove: substitution.TEACHER_ID === this.props.id && substitution.TEACHER_ID !== this.props.id,
                    substitutionType: substitution.TYPE,
                    CLASS_IDS: substitution.CLASS_IDS && substitution.CLASS_IDS.split(','),
                    TEACHER_ID: substitution.TEACHER_ID_NEW,
                    SUBJECT_ID: substitution.SUBJECT_ID_NEW,
                    ROOM_ID: substitution.ROOM_ID_NEW,
                });
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
            if (current.lessons) {
                for (let i = 0; i < current.lessons.length; i++) {
                    let last = current.lessons[i];
                    for (let j = i + 1; j < current.lessons.length; j++) {
                        let lesson = current.lessons[j];
                        if (lesson.ROOM_ID === last.ROOM_ID
                            && lesson.SUBJECT_ID === last.SUBJECT_ID
                            && lesson.substitutionType === last.substitutionType) {
                            if (!last.TEACHER_IDS) {
                                last = current.lessons[i] = { ...last };
                                last.TEACHER_IDS = [last.TEACHER_ID];
                                last.TEACHER_ID = undefined;
                            }
                            last.TEACHER_IDS.push(lesson.TEACHER_ID);
                            current.lessons.splice(j);
                        }
                    }
                }
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
            substitutionText: period.substitutionText,
            substitutionType: period.substitutionType,
            substitutionRemove: period.substitutionRemove,
            teacher: masterdata.Teacher[period.TEACHER_ID]
                || period.TEACHER_IDS && period.TEACHER_IDS.map((t) => masterdata.Teacher[t]),
            subject: masterdata.Subject[period.SUBJECT_ID],
            room: masterdata.Room[period.ROOM_ID],
            classes: (period.CLASS_IDS || []).map((c) => masterdata.Class[c]),
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
        let classIds1 = p1.CLASS_IDS || [];
        let classIds2 = p2.CLASS_IDS || [];

        if (!(classIds1.length == classIds2.length && classIds1.every((v, i) => classIds2.indexOf(v) >= 0)))
            return false;
        return true;
    }

    loadWeek = async (date) => {
        let data = await this.parse(date.week(), date.year());
        return data;
    }

    renderWeek = async (page, grayOut, toggleManager) => {
        try {
            if (!this.props.masterdata.version) {
                return null;
            }
            let content = await this.loadWeek(page.date);
            let components = [];

            for (let x = 0; x < WEEKDAY_NAMES.length; x++) {
                let rows = [];
                let day = content[x];
                if (day.holiday) {
                    rows.push(
                        <GridBox
                            key={0}
                            skip={0}
                            backgroundColor={HOLIDAY_BGCOLOR}
                            toggleManager={toggleManager}
                            renderContent={(horizontal) => (
                                <Text style={styles.holiday}>{day.holiday}</Text>
                            )}
                        />
                    )
                }
                if (day.periods) {
                    for (let y = 0; y < PERIOD_NUMBERS.length; y++) {
                        let period = day.periods[y];
                        if (!period || !period.lessons) {
                            rows.push(
                                <View
                                    key={x * WEEKDAY_NAMES.length + y}
                                    style={styles.container}>
                                </View>
                            );
                        } else {
                            rows.push(
                                <GridBox
                                    skip={period.skip}
                                    edge={{
                                        left: x === 0,
                                        right: x === WEEKDAY_NAMES.length - 1,
                                        top: y === 0,
                                        bottom: y === PERIOD_NUMBERS.length - 1,
                                    }}
                                    toggleManager={toggleManager}
                                    key={x * WEEKDAY_NAMES.length + y}
                                    backgroundColor={PERIOD_BGCOLOR}
                                    renderContent={(horizontal, opened) =>
                                        <Period
                                            type={this.props.type}
                                            data={period.lessons}
                                            opened={opened}
                                            horizontal={horizontal}
                                        />}
                                />
                            );
                            y += period.skip;
                        }
                    }
                }
                components.push(
                    <View
                        key={x}
                        style={styles.column}>
                        {rows}
                    </View>
                );
            }
            return (
                <Animated.View style={[styles.container, { opacity: grayOut }, styles.row]}>
                    {components}
                </Animated.View>
            );
        } catch (err) {
            console.error(err);
            return null;
        }
    }
    render() {

        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.container}>
                    <Grid
                        ref="grid"
                        renderWeek={this.renderWeek}
                        startDate={this.props.startDate}
                        periodTimes={this.props.periodTimes}
                        hasPanResponder
                    >
                    </Grid>
                </View>
            </View>
        );
    }
}