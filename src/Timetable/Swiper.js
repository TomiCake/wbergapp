
import React, { Component } from 'react';

import { View, PanResponder, Animated } from 'react-native';


class Page extends Component {

    constructor(props) {
        super(props);
        this.props.onUpdateCellPositions(this.loadRender.bind(this));
    }

    loadRender() {
        if (this.promise) return;
        this.promise = this.props.page.renderWeek(this.props.page.index)
            .then((rendered) => {
                this.children = rendered;
                this.promise = null;
                this.forceUpdate();
            })
    }

    render() {
        let pageStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',

        };
        if (!this.children && !this.promise) {
            this.loadRender();
        }
        if (this.props.right || this.props.left) {
            let s = 200;
            return (
                <Animated.View style={[pageStyle, {

                    transform: [
                        {
                            translateX: this.props.x.interpolate({
                                inputRange: [0, 10],
                                outputRange: [this.props.right ? s : -s, this.props.right ? s + 1 : -s + 1],
                            })
                        }
                    ],
                    opacity: this.props.x.interpolate({
                        inputRange: [-100, 0, 100],
                        outputRange: [this.props.right ? 0.1 : 0, 0, this.props.left ? 0.1 : 0],
                    })
                }]}>
                    {this.children}
                </Animated.View>
            );
        }

        return (
            <Animated.View style={[pageStyle, {

                transform: [
                    {
                        translateX: this.props.x.interpolate({
                            inputRange: [0, 10],
                            outputRange: [0, 1],
                        })
                    }
                ],
                opacity: this.props.x.interpolate({
                    inputRange: [-100, 0, 100],
                    outputRange: [0.5, 1, 0.5],
                })
            }]}>
                {this.children}
            </Animated.View>
        );
    }
}


export default class Swiper extends Component {

    constructor(props) {
        super(props);
        this.renderPages();
        this.state = {
            x: props.animatedValue,
        }

        this.panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => false,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => Math.abs(gestureState.dx) > 10,

            onPanResponderGrant: (evt, gestureState) => {
                // The gesture has started. Show visual feedback so the user knows
                // what is happening!

                // gestureState.d{x,y} will be set to zero now
            },
            onPanResponderMove: (evt, gestureState) => {
                if (this.anim) return false;
                if (Math.abs(gestureState.dx) >= 200) {
                    this.changePage(gestureState.dx);
                    this.anim = Animated.spring(this.state.x, {
                        toValue: 0
                    });
                    this.anim.start(() => this.anim = null);

                    return false;
                }
                this.state.x.setValue(gestureState.dx);
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                Animated.timing(this.state.x, {
                    toValue: 0
                }).start();
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return false;
            },
        });
    }

    index = 1;
    pages = [];

    changePage(dx) {
        if (dx > 0) {
            this.index++;
        } else {
            this.index--;
        }
        for (i = this.index - 1; i <= this.index + 1; i++) {
            if (!this.pages[i])
                this.pages[i] = { index: i, renderWeek: this.props.renderWeek  };
        }
        this.forceUpdate();

    }

    renderPages() {
        for (i = this.index - 1; i <= this.index + 1; i++) {
            this.pages[i] = { index: i, renderWeek: this.props.renderWeek };
        }
    }

    updateCellPositions() {
        console.log("updateCellPositions", this.pages);
        this.pages.forEach((page) => page.updateCellPositions && page.updateCellPositions())
    }

    render() {
        let page1 = this.pages[this.index - 1];
        let page2 = this.pages[this.index];
        let page3 = this.pages[this.index + 1];
        console.log(page1);
        return (
            <View
                style={{ position: 'absolute', height: '100%', width: '100%' }}
                {...this.panResponder.panHandlers}
            >

                <Page x={this.state.x} left key={page1.index} page={page1}
                    onUpdateCellPositions={(fn) => page1.updateCellPositions = fn}>
                </Page>

                <Page x={this.state.x} key={page2.index} page={page2}
                    onUpdateCellPositions={(fn) => page2.updateCellPositions = fn}>
                </Page>

                <Page x={this.state.x} right key={page3.index} page={page3}
                    onUpdateCellPositions={(fn) => page3.updateCellPositions = fn}>
                </Page>

            </View>
        );
    }
}