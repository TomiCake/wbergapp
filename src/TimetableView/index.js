import React, { Component } from 'react';
import { Animated, ActivityIndicator, View, Text, Button } from 'react-native';
import styles from './styles';
import { connect } from 'react-redux';
import { getMasterdata, getTimetable, getSubstitutions, getSubstitutionsAll } from './api';
import Timetable from '../Timetable';
import AppBar from './AppBar';
import moment from 'moment';
import SearchViewPublic from '../SearchView/index.public';
import CalendarModal from './CalendarModal';
import SubstitutionView from '../SubstitutionView';
import { getPeriodTimesOnline } from '../common';
import { getMasterdataAll, getMasterdataVersion } from './actions';

class TimetableView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            myTimetable: null,
            calendarModal: false,
            startDate: moment(),
            date: moment(),
            id: this.props.id.id,
            type: this.props.id.type,
        };

        this.timetableStore = {

        }

    }

    static navigationOptions = ({ navigation }) => ({
        header: <AppBar
            navigation={navigation}
            onSelect={navigation.state.params && navigation.state.params.onSelect || (() => { })}
            openCalendar={navigation.state.params && navigation.state.params.openCalendar || (() => { })}
            isLoading={navigation.state.params && navigation.state.params.isLoading}
        />
    });

    componentWillReceiveProps(props) {
        if (props.masterdataVersionChanged) {
            this.props.getMasterdataAll();
        }
    }

    componentDidMount() {
        this.props.getMasterdataVersion();
        this.props.navigation.setParams({
            onSelect: this.onSelect.bind(this),
            openCalendar: this.openCalendar.bind(this)
        });
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.loading !== this.state.loading) {
            this.props.navigation.setParams({ isLoading: !!nextState.loading });
        }
    }

    onSelect(id, type) {
        console.log(type, id);
        this.setState({ id, type });
        this.timetableStore = {};
        // clear timetable cache for new id
    }

    openCalendar() {
        this.setState({ calendarModal: true });
    }

    closeCalendar(date) {
        let d = moment(date.dateString).isoWeekday(1);
        this.setState({ calendarModal: false, date: d });
        console.log(d, this.state.startDate);
    }

    loadForTimetable = async (week, year) => {
        let timetable = this.timetableStore.timetable
            || await getTimetable(this.props.token, this.state.type, this.state.id);
        this.timetableStore.timetable = timetable;

        let substitutions = this.timetableStore[week + "" + year]
            || await getSubstitutions(this.props.token, this.state.type, this.state.id, year, week);
        this.timetableStore[week + "" + year] = substitutions;

        return { timetable, substitutions };
    }

    render() {
        return (
            <View style={styles.flex}>
                <View style={styles.container}>
                    {this.state.error ?
                        <View style={styles.errorContainer}>
                            <Text style={styles.error}>{this.state.error}</Text>
                            <Button title="Retry" onPress={() => this.loadData()} />
                        </View> :
                        <Timetable
                            startDate={this.state.startDate.clone().isoWeekday(1).startOf('day')}
                            date={this.state.date.isoWeekday(1).startOf('day')}
                            loadFor={this.loadForTimetable}
                            masterdata={this.props.masterdata}
                            periodTimes={this.props.periodTimes}
                            type={this.state.type}
                            id={this.state.id}
                            onError={(error) => this.setState({ error: error.message })}
                        >
                        </Timetable>
                    }
                </View>
                <CalendarModal visible={this.state.calendarModal} date={this.state.startDate} selectDate={this.closeCalendar.bind(this)} />
            </View>
        );
    }
}

export default connect((state) => {
    return {
        token: state.auth.token,
        masterdata: state.masterdata.masterdata,
        periodTimes: state.masterdata.masterdata.Period_Time,
        masterdataVersionChanged: state.masterdata.masterdata.versionChanged,
        id: state.auth.id
    };
}, (dispatch) => {
    return {
        getMasterdataAll: () => dispatch(getMasterdataAll()),
        getMasterdataVersion: () => dispatch(getMasterdataVersion()),
    }
})(TimetableView);