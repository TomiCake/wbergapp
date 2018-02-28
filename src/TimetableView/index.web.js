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

    componentDidMount() {
        this.loadMasterdata();
        // this.props.navigation.setParams({
        //     onSelect: this.onSelect.bind(this),
        //     openCalendar: this.openCalendar.bind(this)
        // });
    }

    componentWillUpdate(nextProps, nextState) {
        // if (nextState.loading !== this.state.loading) {
        //     this.props.navigation.setParams({ isLoading: !!nextState.loading });
        // }
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
            this.setState({ loading: null, periodTimes });
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
        return (
            <View style={styles.flex}>
                <AppBar onSelect={() => { }} openCalendar={() => { }}/>    
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
                            type={this.state.type}
                            periodTimes={this.state.periodTimes}
                            id={this.state.id}
                            onError={(error) => this.setState({ error: error.message })}
                        >
                        </Timetable>
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