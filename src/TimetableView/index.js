import React, { Component } from 'react';
import { Animated, ActivityIndicator, View, Text, TouchableNativeFeedback, Platform, Button } from 'react-native';
import styles from './styles';
import { connect } from 'react-redux';
import { getMasterdata, getTimetable, getSubstitutions } from './api';
import Timetable from '../Timetable';
import AppBar from './AppBar';
import moment from 'moment';
import { StackNavigator } from 'react-navigation';
import SearchView from '../SearchView';

class TimetableView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            myTimetable: null,
            date: moment().isoWeekday(1),
        };

    }

    static navigationOptions = ({ navigation }) =>({
        header: <AppBar 
            navigation = {navigation} 
            onSelect = {navigation.state.params && navigation.state.params.onSelect || (() => {})} 
            isLoading = {navigation.state.params && navigation.state.params.isLoading}
        />
    });

    componentDidMount(){
        this.loadData();
        this.props.navigation.setParams({onSelect: this.onSelect});
    }

    componentWillUpdate(nextProps, nextState) {
        if(nextState.loading !== this.state.loading) {
            this.props.navigation.setParams({isLoading: !!nextState.loading});
        }
    }

    onSelect(type, id) {
        console.log(type,id);
    }

    loadData = async () => {
        try {
            this.setState({ loading: "Anzeigedaten", error: null, myTimetable: null });
            let version = (await getMasterdata(this.props.token, 'version')).version;
            if (this.props.masterdataVersion !== version) {
                let masterdata = await getMasterdata(this.props.token, 'all');
                console.log("reloaded masterdata");

                this.props.setMasterdata(masterdata);
            }
            this.setState({ loading: "Stundenplandaten" });
            let timetable = await getTimetable(this.props.token, this.props.id.type, this.props.id.id);

            let substitutions = await getSubstitutions(this.props.token, this.props.id.type, this.props.id.id, '2018', '2');
            this.setState({ loading: null, myTimetable: timetable, substitutions });

        } catch (error) {
            if (error.status === 'token_error') {
                this.props.resetToken();
            } else {
                this.setState({loading: "", error: error.message});
            }
            console.log(error);
        }
    }

    async loadSubstitutions(week){
        console.log(this.state.date);
        this.setState({ loading: "neuladen"});

        this.state.date.add(week, 'week');
        let substitutions = await getSubstitutions(this.props.token, this.props.id.type, this.props.id.id, this.state.date.year(), this.state.date.isoWeek());
        this.setState({ loading: null, substitutions });

    }

    render() {
        return (
            <View style={styles.flex}>

                <View style={styles.container}>
                {this.state.error ? 
                    <View style={styles.errorContainer}>
                        <Text style={styles.error}>{this.state.error}</Text>
                        <Button  title="Retry" onPress={() => this.loadData()}/>
                    </View> :
                    <Timetable
                        data={this.state.myTimetable}
                        substitutions={this.state.substitutions}
                        masterdata={this.props.masterdata}
                        type={this.props.id.type}
                        onError={(error) => this.setState({error: error.message})}
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