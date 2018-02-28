import React, { Component } from 'react';

interface TimetableData {
    timetable: object;
    substitutions: object;
}

interface TimetableProps {
    startDate: moment;
    date: moment;
    loadFor: (week, year) => TimetableData;
    masterdata: {};
    type: string;
    periodTimes: [];
    id: number;
    onError: (error) => void;
}

export default class Timetable extends Component<TimetableProps> {

}