import React, { Component } from 'react';

import { FlatList, View, Text, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import Icon from '../components/Icon';
import AppBar from './AppBar';
import Touchable from '../components/Touchable';

const ListItem = (props) => (
    <Touchable
        onPress={() => props.select(props.item.id, props.item.type)}>
        <View style={styles.listItem}>
            <View style={styles.listItemNameType}>
                <Text style={styles.listItemName}>
                    {props.item.name}
                </Text>
                <Text style={styles.listItemType}>
                    {props.item.typeName}
                </Text>
            </View>
            <Icon
                iconStyle={styles.button}
                name='chevron-right'
                color="#333333"
                reverse
                size={15}
            />
        </View>
    </Touchable>
);

class SearchView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.filterData()
        }
    }

    filterData(filter) {
        const masterdata = this.props.masterdata;
        const data =
            ['Teacher', 'Class', 'Room', 'Student'].reduce((result, type, i) =>
                [...result,
                ...Object.keys(masterdata[type]).map((key) => ({
                    name: (i == 1 || i == 2) ?
                        masterdata[type][key].NAME :
                        masterdata[type][key].LASTNAME + ", " + masterdata[type][key].FIRSTNAME,
                    filtername: masterdata[type][key].NAME + " " + masterdata[type][key].LASTNAME + " " + masterdata[type][key].FIRSTNAME + " " + masterdata[type][key].LASTNAME,
                    typeName: ["Lehrer", "Klassen", "Räume", "Schüler"][i],
                    type: type.toLowerCase(),
                    id: key
                }))
                ]
                , []);
        return !filter ? data : data.filter((item) => {
            return new RegExp(`${filter}`, "gi").test(item.filtername)
        });
    }

    componentDidMount() {
        this.props.navigation.setParams({ onChangeText: this.onChangeText });
    }

    static navigationOptions = ({ navigation }) => ({
        header: <AppBar goBack={navigation.goBack} onChangeText={navigation.state.params && navigation.state.params.onChangeText} />,
    });

    onChangeText = (text) => {
        this.setState({ data: this.filterData(text) });
    }

    select(id, type) {
        this.props.navigation.goBack();
        this.props.navigation.state.params.onSelect(id, type);
        Keyboard.dismiss();
    }

    render() {
        return (
            <FlatList
                keyboardShouldPersistTaps={'handled'}
                renderItem={({ item }) => <ListItem item={item} select={(id, type) => { this.select(id, type) }} />}
                keyExtractor={(item, index) => `${item.type}-${item.id}`}
                data={this.state.data}
            />
        );
    }
}

export default connect((state) => {
    return {
        masterdata: state.masterdata.masterdata,
    };
})(SearchView);