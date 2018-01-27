import React, { Component } from 'react';

import { View, TextInput, TouchableNativeFeedback, Platform, ListView, Text } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const row = (user) => (
    <TouchableNativeFeedback
        background={Platform.select({ android: TouchableNativeFeedback.SelectableBackground() })}
    >
        <View style={styles.row}>
            <Text>
                {user.FIRSTNAME ? user.LASTNAME + ", " + user.FIRSTNAME : user.NAME}
            </Text>
            <Text>
                {user.type}
            </Text>
        </View>
    </TouchableNativeFeedback>
);

class SearchView extends Component {

    constructor(props) {
        super(props);
        this.entries = [];
        const masterdata = this.props.masterdata;
        ['Teacher', 'Class', 'Room', 'Student'].forEach((type) =>
            this.entries.push(...Object.keys(masterdata[type])
                .map((key) => {
                    let obj = masterdata[type][key];
                    obj.type = type;
                    return obj;
                })
            )
        )

        this.state = {
            dataSource: this.getDataSource()
        }
    }

    static navigationOptions = ({ navigation }) =>({
        header: SearchView.renderHeader(),
    });

    getDataSource = (text = "") => {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        return ds.cloneWithRows(this.entries.filter((elem) => (elem.FIRSTNAME ? elem.FIRSTNAME + " " + elem.LASTNAME : elem.NAME).indexOf(text) !== -1));
    }

    onChangeText = (text) => {
        this.setState({ dataSource: this.getDataSource(text) });
    }

    static renderHeader() {
       return (
       <View style={styles.textInput}>
            <TextInput
                style={{ flex: 1 }}
                ref="textInput"
                keyboardType="number-pad"
                placeholder="Suchen"
                enablesReturnKeyAutomatically
                underlineColorAndroid="white"
                blurOnSubmit
                onChangeText={this.onChangeText}
            />
            <TouchableNativeFeedback
                background={Platform.select({ android: TouchableNativeFeedback.Ripple() })}
                onPress={() => this.refs.textInput.clear()}>
                <Icon name="close" size={28} color="gray" />
            </TouchableNativeFeedback>
        </View>
        )
    }
    render() {
        return (
            <View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={row}>

                </ListView>
            </View>
        );
    }
}

export default connect((state) => {
    return {
        masterdata: state.timetable.masterdata,
    };
})(SearchView);