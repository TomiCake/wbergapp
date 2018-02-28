import React from 'react';
import { View, TouchableNativeFeedback, TouchableOpacity, Platform, TouchableHighlight } from 'react-native';

const Component = Platform.select({
    default: TouchableOpacity,
    android: TouchableNativeFeedback,
});

export default (props) => (
    <Component {...props}
        background={
            Platform.OS === 'android' && (props.background || TouchableNativeFeedback.SelectableBackground())
        } />
);
