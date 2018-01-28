import React, { Component } from 'react';

import { View, Text, ScrollView, Animated, TouchableWithoutFeedback, TouchableOpacity, TouchableNativeFeedback, TouchableHighlight, Dimensions } from 'react-native';
import styles from './gridAlignedBox.styles';

class AnimatedMargin extends Animated.Value {
    constructor(value, margin) {
        super(value + margin);
        this.startingValue = value;
    }

    animateMargin(animatedFunction, margin, config = { duration: 250 }) {
        return animatedFunction(this, {
            ...config,
            bounciness: 15,
            toValue: this.startingValue + margin,
        });
    }

    setStartingValue(startingValue, margin) {
        this.startingValue = startingValue;
        this.updateWithMargin(margin);
    }

    updateWithMargin(margin) {
        this.setValue(this.startingValue + margin);
    }
}

export default class GridAlignedBox extends Component {


    constructor(props) {
        super(props);


        const height = this.props.boundingBox.height * (this.props.skip + 1)
            + this.props.skip;
        this.state = {
            margin: 2,
        };
        this.state.animatedValues = {
            top: new AnimatedMargin(this.props.boundingBox.top, this.state.margin),
            left: new AnimatedMargin(this.props.boundingBox.left, this.state.margin),
            width: new AnimatedMargin(this.props.boundingBox.width, - 2 * this.state.margin),
            height: new AnimatedMargin(height, - 2 * this.state.margin),

        };
        this.state.toggled = new Animated.Value(0);
    }
    toggled = false;

    toggle = (e) => {
        this.animate(this.toggled = !this.toggled);
        this.setState({ toggledBoolean: this.toggled });
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState == this.state) {
            let margin = 2;
            const height = nextProps.boundingBox.height * (nextProps.skip + 1)
                + nextProps.skip;
            this.state.animatedValues.top.setStartingValue(nextProps.boundingBox.top, this.state.margin);
            this.state.animatedValues.left.setStartingValue(nextProps.boundingBox.left, this.state.margin);
            this.state.animatedValues.width.setStartingValue(nextProps.boundingBox.width, - 2 * this.state.margin);
            this.state.animatedValues.height.setStartingValue(height, - 2 * this.state.margin);
        }
    }

    animate(toggled) {
        const margin = toggled ? -10 : 2;
        Animated.parallel([
            this.state.animatedValues.top.animateMargin(Animated.timing, margin),
            this.state.animatedValues.left.animateMargin(Animated.timing, margin),
            this.state.animatedValues.width.animateMargin(Animated.timing, -2 * margin),
            this.state.animatedValues.height.animateMargin(Animated.timing, -2 * margin),
            Animated.timing(this.state.toggled, { toValue: toggled ? 1 : 0 })
        ]).start();
    }

    render() {


        const computedStyle = {
            zIndex: this.state.toggled.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }),
            backgroundColor: this.state.toggled.interpolate({
                inputRange: [0, 1],
                outputRange: [this.props.backgroundColor, '#383847']
            })
        }

        const horizontal = this.props.boundingBox.width > this.props.boundingBox.height * 1.5;

        return (
            <Animated.ScrollView
                style={[this.state.animatedValues, computedStyle, styles.container]}
            >
                <TouchableWithoutFeedback
                    onPress={this.props.expandable && this.toggle}>
                    <Animated.View
                        style={[
                            { minHeight: this.state.animatedValues.height }, styles.contentContainer, this.props.contentContainerStyle
                        ]}>

                        {this.props.renderContent(this.state.toggledBoolean, this.state.toggled)}
                    </Animated.View>
                </TouchableWithoutFeedback>

            </Animated.ScrollView>
        );
    }
}