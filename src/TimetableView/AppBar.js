
import React, { Component } from 'react';
import styles from './appBar.styles';

import { View, Text, Image, StatusBar } from 'react-native';
import { Icon } from 'react-native-elements';
import { Bar } from 'react-native-progress';

export default class AppBar extends Component {

    open(path) {
        this.props.navigation.navigate(path, {onSelect: this.props.onSelect});
    }

    render() {
        return (
            <View style={styles.appBar}>
                <View style={styles.firstRow}>
                    <StatusBar backgroundColor={"#1976D2"}/>
                    <Image
                        source={require('wbergapp/img/logowhite.png')}
                        resizeMode="contain"
                        style={{ height: 35, width: 90 }}>
                    </Image>
                    <Text style={styles.title}>Stundenplan</Text>
                    <View style={styles.buttons}>
                        <Icon
                            iconStyle={styles.button}
                            name = 'date-range'
                            color = "white"
                            onPress={() => {this.props.navigation.navigate('calendar')}} />
                        <Icon
                            iconStyle={styles.button}
                            name = 'search'
                            color = "white"
                            onPress={this.open.bind(this, 'Search')} />
                    </View>
                </View>
                <Bar 
                    borderRadius = {0}
                    width = {null}
                    unfilledColor = "#1976D2"
                    color = "#4CAF50"
                    height = {3}
                    useNativeDriver = {true}
                    indeterminate = {this.props.isLoading}
                    borderWidth = {0}
                />
            </View>
        );
    }
}