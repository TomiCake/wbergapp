
import React, { Component } from 'react';
import styles from './appBar.styles';

import { View, Text, Image, StatusBar, Button } from 'react-native';


export default class AppBar extends Component {

    render() {
        return (
            <View style={styles.appBar}>
                <StatusBar backgroundColor={"#002171"}/>
                <Image
                    source={require('wbergapp/img/logo.png')}
                    resizeMode="contain"
                    style={{ height: 25, width: 60, marginRight: 5 }}>

                </Image>
                

                <Text style={styles.title}>Wolkenberg</Text>
                <View style={styles.buttons}>
                    <Button title="Prev" onPress={this.props.onPrevious}/>
                    <Button title="Next" onPress={this.props.onNext}/>
                </View>
            </View>
        );
    }
}