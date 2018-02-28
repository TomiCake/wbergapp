import React, { Component } from 'react';
import { Animated, ActivityIndicator, View, Text, Button } from 'react-native';
import styles from './styles';
import { connect } from 'react-redux';
import { getMasterdata, getTimetable, getSubstitutions, getSubstitutionsAll } from './api';
import Timetable from '../Timetable';
import AppBarPublic from './AppBar.public';
import moment from 'moment';
import SearchViewPublic from '../SearchView/index.public';
import CalendarModal from './CalendarModal';
import SubstitutionView from '../SubstitutionView';
import { getPeriodTimesOnline } from '../common';

class TimetableView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            myTimetable: null,
            calendarModal: false,
            startDate: moment(),
            date: moment(),
        };

        this.timetableStore = {

        }

    }

    componentDidMount() {
        this.loadMasterdata();
    }

    onSelect(id, type) {
        console.log(type, id);
        this.setState({ id, type });
        this.timetableStore = {};
        // clear timetable cache for new id
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => this.setState({ id: null, type: null }), 60000);

    }

    openCalendar() {
        this.setState({ calendarModal: true });
    }

    closeCalendar(date) {
        let d = moment(date.dateString).isoWeekday(1);
        this.setState({ calendarModal: false, date: d });
        console.log(d, this.state.startDate);
    }

    loadMasterdata = async () => {
        try {
            this.setState({ loading: "Anzeigedaten", error: null, myTimetable: null });
            let version = (await getMasterdata(this.props.token, 'version')).version;
            if (this.props.masterdataVersion !== version) {
                let masterdata = await getMasterdata(this.props.token, 'all');
                console.log("reloaded masterdata");
                this.props.setMasterdata(masterdata);
            }
            let periodTimes = await getPeriodTimesOnline(this.props.token);
            let date = this.state.startDate.clone();
            let substitutions = await getSubstitutionsAll(this.props.token, date.year(), date.isoWeek());

            let substitutionsArray = [substitutions, substitutions];
            if (date.isoWeekday() === 5) { // friday
                while (date.isoWeekday() >= 5) {
                    date.add(1, 'day');
                }
                substitutionsArray[1] =
                    await getSubstitutionsAll(this.props.token, date.year(), date.isoWeek());
            }

            this.setState({ loading: null, substitutionsArray, periodTimes });
        } catch (error) {
            if (error.status === 'token_error') {
                this.props.resetToken();
            } else {
                this.setState({ loading: "", error: error.message });
            }
            console.log(error);
        }
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
        let tomorrow = this.state.startDate.clone();
        let substitutions = this.state.substitutionsArray || [];
        do {
            tomorrow = tomorrow.add(1, 'day');
        } while (tomorrow.isoWeekday() > 5);

        if (this.props.masterdata.version && this.state.type) {
            let object = this.props.masterdata[this.state.type[0].toUpperCase() + this.state.type.slice(1)][this.state.id];
            var information = {
                type: this.state.type,
                name: object.LASTNAME ? (object.FIRSTNAME[0] + ". " + object.LASTNAME) : object.NAME
            };
        }

        return (
            <View style={styles.flex}>
                <View style={styles.container}>
                    {this.state.error ?
                        <View style={styles.errorContainer}>
                            <Text style={styles.error}>{this.state.error}</Text>
                            <Button title="Retry" onPress={() => this.loadData()} />
                        </View> :
                        <View style={[styles.container, styles.row]}>
                            <SubstitutionView
                                substitutions={substitutions[0]}
                                masterdata={this.props.masterdata}
                                date={this.state.startDate}
                            />
                            <SubstitutionView
                                substitutions={substitutions[1]}
                                masterdata={this.props.masterdata}
                                date={tomorrow}
                            />
                            <View style={styles.container}>
                                <AppBarPublic
                                    information={information}
                                    masterdata={this.props.masterdata}
                                    next={() =>
                                        this.setState({ date: this.state.date.clone().add(1, 'week') })}
                                    previous={() =>
                                        this.setState({ date: this.state.date.clone().add(-1, 'week') })}
                                    close={() => this.onSelect()} />
                                {this.state.id && this.state.type ?
                                    <Timetable
                                        startDate={this.state.startDate.clone().isoWeekday(1).startOf('day')}
                                        date={this.state.date.isoWeekday(1).startOf('day')}
                                        type={this.state.type}
                                        id={this.state.id}
                                        periodTimes={this.state.periodTimes}
                                        loadFor={this.loadForTimetable}
                                        masterdata={this.props.masterdata}
                                        onError={(error) => this.setState({ error: error.message })}
                                    >
                                    </Timetable>
                                    :
                                    <SearchViewPublic onSelect={this.onSelect.bind(this)} />
                                }
                            </View>
                        </View>
                    }
                </View>
                
            </View>
        );
    }
}

export default connect((state) => {
    return {
        token: state.auth.token,
        masterdata: state.timetable.masterdata,
        masterdataVersion: state.timetable.masterdata.version,
        id: state.auth.id
    };
}, (dispatch) => {
    return {
        setMasterdata: (masterdata) => dispatch({ type: 'SET_MASTERDATA', payload: masterdata }),
        resetToken: () => dispatch({ type: 'SET_TOKEN', payload: null })
    }
})(TimetableView);