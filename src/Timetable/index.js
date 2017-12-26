import React, { Component } from 'react';
import styles from './styles';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import WeekView from './WeekView';
import LessonView from './LessonView';

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
        if (periods)
            periods = periods.map((period) => {
                let subs = null;
                if (this.substitutions && this.substitutions.substitutions) {
                    subs = this.substitutions.substitutions
                        .filter((elem) =>
                            elem.PERIOD === p &&
                            elem.LESSON_ID === period.LESSON_ID &&
                            elem.TEACHER_ID === period.TEACHER_ID
                        )
                        .map((substitution) => {
                            return {
                                orig: substitution,
                                flagsOrig: substitution.FLAGS,
                                flags: toObject(substitution.FLAGS),
                                teacher: props.teachers[substitution.TEACHER_ID_NEW],
                                subject: props.subjects[substitution.SUBJECT_ID_NEW],
                                room: props.rooms[substitution.ROOM_ID_NEW],
                                text: substitution.TEXT
                            };
                        });

                }
                let obj = {
                    teacher: masterdata.Teacher[period.TEACHER_ID],
                    subject: masterdata.Subject[period.SUBJECT_ID],
                    room: masterdata.Room[period.ROOM_ID],
                    classes: period.CLASS_IDS.map((c) => masterdata.Class[c].NAME),
                    substitutions: subs

                };
                return obj;
            });
        return <LessonView periods={periods}  />;
    }

    render() {
        return (
            <WeekView
                amount={2}
                renderLesson={this.renderLesson}/>
        );
    }
}