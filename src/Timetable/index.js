import React, { Component } from 'react';
import styles from './styles';
import PropTypes from 'prop-types';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
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
        this.state.data = this.parse();
    }
    componentWillUpdate() {
        this.state.data = this.parse();
    }

    parse() {
        let data = [];
        for (x = 0; x < WEEKDAY_NAMES.length; x++) {
            let day = this.readTimetable(x);
            this.joinSubstitutions(day, this.props.substitutions[x + 1]);
            this.skipDuplications(day);
            this.translatePeriods(day);
            data[x] = day;
        }

        console.log(data);
        return data;

    }

    readTimetable(day) {
        let data = [];
        for (y = 0; y < PERIOD_NUMBERS.length; y++) {
            let lessons = this.props.data[day + 1][y + 1];
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
            substitutionType: period.substitutionType,
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
        layout.x = 40; //width of periods container
        const screenWidth = layout.width - layout.x;
        const screenHeight = layout.height;

        let height = screenHeight / PERIOD_NUMBERS.length;
        let width = screenWidth / WEEKDAY_NAMES.length;
        this.state.cellPositions = [[], [], [], [], []];

        for (x = 0; x < WEEKDAY_NAMES.length; x++) {
            for (y = 0; y < PERIOD_NUMBERS.length; y++) {
                this.state.cellPositions[x][y] = { width, height, left: width * x + layout.x, top: height * y + layout.y };
            }
        }
        this.forceUpdate();
    }

    renderWeek = (timetable) => {
        let components = [];
        const cellPositions = this.state.cellPositions;
        for (let x = 0; x < WEEKDAY_NAMES.length; x++) {
            let day = this.state.data[x];
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
                    >
                    </Grid>
                    {
                        this.state.cellPositions &&
                        <Swiper
                            renderPage={() => this.renderWeek(this.state.data)}>
                        </Swiper>
                    }
                </View>
            </View>
        );
    }
}