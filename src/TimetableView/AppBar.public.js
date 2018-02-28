
import React, { Component } from 'react';
import styles from './appBar.styles';

import { View, Text, Image, StatusBar } from 'react-native';
import Icon from '../components/Icon';
import { Bar } from 'react-native-progress';

export default class AppBar extends Component {
    render() {
        return (
            <View style={styles.appBar}>
                <View style={styles.firstRow}>
                    <StatusBar backgroundColor={"#1976D2"} />
                    <Image
                        source={require('../../img/logowhite.png')}
                        resizeMode="contain"
                        style={{ height: 35, width: 90 }}>
                    </Image>
                    <View stlye={[styles.flex, styles.column]}>
                        <Text style={styles.title}>Stundenplan</Text>
                        {this.props.information &&
                            <Text style={styles.subtitle}>({this.props.information.name})</Text>
                        }
                    </View>
                    <View style={styles.buttons}>
                        <Icon
                            iconStyle={styles.button}
                            name='navigate-before'
                            color="white"
                            onPress={() => this.props.previous()} />
                        <Icon
                            iconStyle={styles.button}
                            name='navigate-next'
                            color="white"
                            onPress={() => this.props.next()} />
                        <Icon
                            iconStyle={styles.button}
                            name='close'
                            color="white"
                            onPress={() => this.props.close()} />

                    </View>
                </View>
                <Bar
                    borderRadius={0}
                    width={null}
                    unfilledColor="#1976D2"
                    color="#4CAF50"
                    height={3}
                    useNativeDriver={true}
                    indeterminate={this.props.isLoading}
                    borderWidth={0}
                />
            </View>
        );
    }
}