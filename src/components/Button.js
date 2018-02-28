import React, { Component } from 'react';

import { Button, Platform, Text, View } from 'react-native';
import Touchable from './Touchable';

export default Platform.select({
    default: Button,
    // windows: (props) => (
    //     <Touchable onPress={props.onPress}>
    //         <View style={{ backgroundColor: props.color }}>    
    //             <Text>{props.title}</Text>
    //         </View>
    //     </Touchable>
    // ),
})