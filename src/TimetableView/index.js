import React, { Component } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import styles from './styles';
import { connect } from 'react-redux';
import { getMasterdata, getTimetable } from './api';
import Timetable from '../Timetable';

class TimetableView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            myTimetable: null,
            loading: "null",
        };

    }

    async componentDidMount() {
        try {
            let version = (await getMasterdata(this.props.token, 'version')).version;
            this.setState({ loading: "Anzeigedaten" });
            if (this.props.masterdataVersion !== version) {
                let masterdata = await getMasterdata(this.props.token, 'all');
                console.log("reloaded masterdata");

                this.props.setMasterdata(masterdata);
            }
            this.setState({ loading: "Stundenplandaten" });
            let timetable = await getTimetable(this.props.token, this.props.id.type, this.props.id.id);
        
            this.setState({ loading: null, myTimetable: timetable });
        } catch (error) {
            console.log("error while loading TimetableView", error);
            if (error.status === 'token_error') {
                this.props.resetToken();
            }
        }    
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.error ? <Text style={styles.error}>{this.state.error}</Text> : null}

                {this.state.loading ?
                    <View style={styles.loadingBox}>
                        <ActivityIndicator
                            size={80}
                        />
                        <Text>{this.state.loading}</Text>
                    </View>
                    : 
                    <Timetable
                        data={this.state.myTimetable}
                        masterdata={this.props.masterdata}
                    >
                    </Timetable>
                }
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
        resetToken: () => dispatch({type: 'SET_TOKEN', payload: null})
    }
})(TimetableView);