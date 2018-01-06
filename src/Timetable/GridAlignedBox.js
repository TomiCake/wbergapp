import React, { Component } from 'react';

import { View, Text, ScrollView, Animated, TouchableWithoutFeedback, TouchableOpacity, TouchableNativeFeedback, TouchableHighlight, Dimensions } from 'react-native';
import styles from './gridAlignedBox.styles';

export default class GridAlignedBox extends Component {

    constructor(props) {
        super(props);


        this.state = {
            toggled: false,
        }
    }

    toggle = (e) => {
        this.setState({ toggled: !this.state.toggled });
    }

    render() {
        const margin = this.state.toggled ? -10 : 2;
        const height = this.props.boundingBox.height * (this.props.skip + 1)
            + this.props.skip - 2 * margin;


        const computedStyle = {
            top: this.props.boundingBox.top + margin,
            left: this.props.boundingBox.left + margin,
            width: this.props.boundingBox.width - 2 * margin,
            height: this.state.toggled ? undefined : height,
            minHeight: height,
            elevation: this.state.toggled ? 3 : 0,
            zIndex: this.state.toggled ? 3 : 0,
            backgroundColor: this.state.toggled ? '#383847' : this.props.backgroundColor
        }
        const dimenions = Dimensions.get('window');
        computedStyle.left = Math.min(dimenions.width - computedStyle.width, computedStyle.left);
        computedStyle.top = Math.min(dimenions.height - 50, computedStyle.top);

        const horizontal = this.props.boundingBox.width > this.props.boundingBox.height * 1.5;


        return (
            <ScrollView
                style={[computedStyle, styles.container]}
                contentContainerStyle={[styles.contentContainer]}
            >
                <TouchableWithoutFeedback
                    onPress={this.props.expandable && this.toggle}>
                    <View
                        style={[{ minHeight: height - 10 }, this.props.contentContainerStyle]}>
                        {this.props.renderContent(horizontal)}
                    </View>
                </TouchableWithoutFeedback>

            </ScrollView>
        );
    }
}