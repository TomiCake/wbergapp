import React, { Component } from 'react';

import { UIManager, View, Text, ScrollView, Animated, TouchableWithoutFeedback, TouchableOpacity, TouchableNativeFeedback, TouchableHighlight, Dimensions, LayoutAnimation } from 'react-native';
import styles from './gridAlignedBox.styles';
UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

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


        let computedStyle = {
            top: this.props.boundingBox.top + margin,
            left: this.props.boundingBox.left + margin,
            width: this.props.boundingBox.width - 2 * margin,
            height: this.state.toggled ? undefined : height,
            minHeight: height,
            elevation: this.state.toggled ? 3 : 0,
            zIndex: this.state.toggled ? 3 : 0,
            backgroundColor: this.state.toggled ? '#383847' : this.props.backgroundColor
        }
        if (this.state.toggled) {
            computedStyle.left -= this.props.boundingBox.width / 2;
            computedStyle.width += this.props.boundingBox.width;
        }

        const dimenions = Dimensions.get('window');
        computedStyle.left = Math.min(dimenions.width - computedStyle.width, Math.max(computedStyle.left, 10));
        computedStyle.top = Math.min(dimenions.height - 50, Math.max(computedStyle.top, 0));

        const horizontal = computedStyle.width > this.props.boundingBox.height * 1.5;


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