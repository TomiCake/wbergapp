import React, { Component } from 'react';
import { Animated, ActivityIndicator, View, Text, Button } from 'react-native';
import styles from './styles';
import { connect } from 'react-redux';
import { getMasterdata, getTimetable, getSubstitutions, getSubstitutionsAll } from './api';
import Timetable from '../Timetable';
import AppBar from './AppBar';
import moment from 'moment';
import SearchView from '../SearchView';
import CalendarModal from './CalendarModal';
import SubstitutionView from '../SubstitutionView';

class TimetableView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            myTimetable: null,
            calendarModal: false,
            date: moment().isoWeekday(1),
            id: this.props.id.id,
            type: this.props.id.type,
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
    }

    openCalendar() {
        this.setState({ calendarModal: true });
    }

    closeCalendar(date) {
        this.setState({ calendarModal: false });
        console.log(date);
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
            let substitutions = await getSubstitutionsAll(this.props.token, '2018', '8');
            this.setState({ loading: null, substitutions });
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
                <AppBar />
                <View style={styles.container}>
                    {this.state.error ?
                        <View style={styles.errorContainer}>
                            <Text style={styles.error}>{this.state.error}</Text>
                            <Button title="Retry" onPress={() => this.loadData()} />
                        </View> :
                        APP ?
                            <Timetable
                                date={this.state.date}
                                loadFor={this.loadForTimetable}
                                masterdata={this.props.masterdata}
                                type={this.state.type}
                                id={this.state.id}
                                onError={(error) => this.setState({ error: error.message })}
                            >
                            </Timetable>
                            :
                            <View style={[styles.container, styles.row]}>
                                <SubstitutionView
                                    substitutions={this.state.substitutions}
                                    masterdata={this.props.masterdata}
                                    day={4}
                                />
                                <Timetable
                                    date={this.state.date}
                                    loadFor={this.loadForTimetable}
                                    masterdata={this.props.masterdata}
                                    type={this.state.type}
                                    id={this.state.id}
                                    onError={(error) => this.setState({ error: error.message })}
                                >
                                </Timetable>
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