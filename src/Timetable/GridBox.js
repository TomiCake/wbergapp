import React, { Component } from 'react';

import { View, ScrollView, Animated, TouchableWithoutFeedback } from 'react-native';
import styles from './GridBox.styles';

const EXPANDATION_VERTICAL = 20;
const EXPANDATION_HORIZONTAL = 40;

export default class GridBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: new Animated.Value(0),
        }
        this.toggleValue = false;
        this.toggleBound = this.toggle.bind(this);
    }
    toggle() {
        this.toggleValue = !this.toggleValue;
        if (this.toggleValue) {
            this.props.toggleManager.toggled(this.toggleBound);
        } else {
            this.props.toggleManager.unToggled();
        }
        Animated.spring(this.state.value, {
            toValue: this.toggleValue ? 1 : 0,
        }).start();
        this.forceUpdate();
    }

    render() {
        if (this.props.edge) {
            let { top, left, right, bottom } = this.props.edge;
            // needs testing on all platforms
            let animationVertical = this.state.value.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -EXPANDATION_VERTICAL * (top || bottom ? 2 : 1)],
            });
            let animationHorizontal = this.state.value.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -EXPANDATION_HORIZONTAL * (left || right ? 2 : 1)],
            });
            var style = {
                flex: this.props.skip + 1,
                marginTop: top ? 0 : animationVertical,
                marginBottom: bottom ? 0 : animationVertical,
                marginLeft: left ? 0 : animationHorizontal,
                marginRight: right ? 0 : animationHorizontal,
                minHeight: this.state.value.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, EXPANDATION_VERTICAL * 2],
                }),
                zIndex: this.state.value.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 2]
                }),
            };
        } else {
            var style = {
                flex: 1,
            }
        }
        return (
            <TouchableWithoutFeedback
                onPress={this.toggle.bind(this)}>
                <Animated.View
                    style={style}>
                    <Animated.ScrollView
                        style={[styles.container, {
                            backgroundColor: this.state.value.interpolate({
                                inputRange: [0, 1],
                                outputRange: [(this.props.backgroundColor), '#333'],
                            })
                        }]}
                        contentContainerStyle={[styles.contentContainer, {
                            backgroundColor: 'transparent',
                            minHeight: '100%'
                            // this fixes wierdly Touchable bug on windows
                            // (creates a full content view (you can see scrollindication))
                        }]}>
                        {this.props.renderContent(this.props.horizontal, this.toggleValue)}
                    </Animated.ScrollView>
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}