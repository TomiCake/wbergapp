import React, { Component } from 'react';

import { View, Text, ScrollView, Animated, TouchableWithoutFeedback, TouchableOpacity, TouchableNativeFeedback, TouchableHighlight, Dimensions } from 'react-native';
import styles from './gridAlignedBox.styles';

class AnimatedMargin extends Animated.Value {
    constructor(value, margin) {
        super(value + margin);
        this.startingValue = value;
    }

    animateMargin(animatedFunction, margin, config = {duration: 250}) {
        return animatedFunction(this, {
            ...config,
            toValue: this.startingValue + margin,
        });
    }

    setStartingValue(startingValue, margin){
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
            toggled: false,
            margin: 2,
        };
        this.state.animatedValues = {
            top: new AnimatedMargin(this.props.boundingBox.top, this.state.margin),
            left: new AnimatedMargin(this.props.boundingBox.left, this.state.margin),
            width: new AnimatedMargin(this.props.boundingBox.width, - 2 * this.state.margin),
            height: new AnimatedMargin(height, - 2 * this.state.margin),
        };
    }

    toggle = (e) => {
        let margin = !this.state.toggled ? -10 : 2;
        this.animate(margin);
        this.setState({ toggled: !this.state.toggled, margin });
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState == this.state) {
            let margin = this.state.margin;
            const height = nextProps.boundingBox.height * (nextProps.skip + 1)
            + nextProps.skip;
            this.state.animatedValues.top.setStartingValue(nextProps.boundingBox.top, this.state.margin);
            this.state.animatedValues.left.setStartingValue(nextProps.boundingBox.left, this.state.margin);
            this.state.animatedValues.width.setStartingValue(nextProps.boundingBox.width, - 2 * this.state.margin);
            this.state.animatedValues.height.setStartingValue(height, - 2 * this.state.margin);
        }
    }

    animate(margin) {
        Animated.parallel([
            this.state.animatedValues.top.animateMargin(Animated.timing, margin),
            this.state.animatedValues.left.animateMargin(Animated.timing, margin),
            this.state.animatedValues.width.animateMargin(Animated.timing, -2 * margin + (!this.state.toggled ? 100 : 0)),
            this.state.animatedValues.height.animateMargin(Animated.timing, -2 * margin),
        ]).start();
    }

    render() {


        const computedStyle = {
            zIndex: this.state.toggled ? 3 : 0,
            backgroundColor: this.state.toggled ? '#383847' : this.props.backgroundColor
        }

        const horizontal = this.props.boundingBox.width > this.props.boundingBox.height * 1.5;


        return (
            <Animated.ScrollView
                style={[this.state.animatedValues, computedStyle, styles.container]}
                contentContainerStyle={[styles.contentContainer]}
            >
                <TouchableWithoutFeedback
                    onPress={this.props.expandable && this.toggle}>
                    <View
                        style={[{ minHeight: this.props.boundingBox.height}, this.props.contentContainerStyle]}>
                        {this.props.renderContent(horizontal || this.state.toggled)}
                    </View>
                </TouchableWithoutFeedback>

            </Animated.ScrollView>
        );
    }
}