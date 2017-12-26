
import React from 'react';
import { Text, View } from 'react-native';

export default (props) => (
    <View style={props.style}>
        <Text>{props.children}</Text>
    </View>
);