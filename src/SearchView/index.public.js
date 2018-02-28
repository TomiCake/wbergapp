import React, { Component } from 'react';

import { FlatList, View, Text, Keyboard, Platform } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import Icon from '../components/Icon';
import AppBar from './AppBar.public';
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
        if (props.masterdata.version) {
            this.initData(props.masterdata);
        }
        this.state = {
            data: this.filterData()
        };

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.masterdata.version !== this.props.masterdata.version) {
            this.initData(nextProps.masterdata);
            this.setState({ data: this.filterData() });
        }
    }
    initData(masterdata) {
        this.data = ['Class', 'Room', 'Student', 'Teacher'].reduce((result, type, i) =>
            [...result,
            ...Object.keys(masterdata[type]).map((key) => ({
                name: masterdata[type][key].LASTNAME ?
                    masterdata[type][key].LASTNAME + ", " + masterdata[type][key].FIRSTNAME :
                    masterdata[type][key].NAME,
                filtername: masterdata[type][key].NAME + " " + masterdata[type][key].LASTNAME + " " + masterdata[type][key].FIRSTNAME + " " + masterdata[type][key].LASTNAME,
                typeName: ["Klassen", "Räume", "Schüler", "Lehrer"][i],
                type: type.toLowerCase(),
                id: key
            }))
            ]
            , []);
    }

    filterData(filter) {
        filter = filter && filter.toLowerCase();
        return (!filter ? this.data : this.data.filter((item) => {
            return item.filtername.toLowerCase().indexOf(filter) !== -1;
        }) || []);
    }

    onChangeText = async (text) => {
        this.setState({ data: this.filterData(text) });
    }

    select(id, type) {
        this.props.onSelect(id, type);
    }

    render() {
        return (
            <View style={styles.flex}>
                <AppBar onChangeText={this.onChangeText.bind(this)} public goBack={() => { }} />
                <FlatList
                    style={styles.flex}    
                    ref="list"
                    keyboardShouldPersistTaps={'handled'}
                    renderItem={({ item, index }) => (<ListItem
                        key={index}
                        item={item}
                        select={(id, type) => { this.select(id, type) }}
                    />)}
                    // getItemLayout={(data, index) => (
                    // { length: 40, offset: 40 * index, index }
                    // )}
                    keyExtractor={(item, index) => `${item.type}-${item.id}`}
                    data={this.state.data}
                    initialNumToRender={2}
                    maxToRenderPerBatch={1}
                    updateCellsBatchingPeriod={1000}

                />
            </View>
        );
    }
}

export default connect((state) => {
    return {
        masterdata: state.timetable.masterdata,
    };
})(SearchView);