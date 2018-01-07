
import React, { Component } from 'react';

import { View, PanResponder, Animated } from 'react-native';


class Page extends Component {


    render() {
        let pageStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',

        };
        let child = this.children || this.props.children;
        if(!child) return null;
        if(child.then){
            child.then((rendered) => {
                this.children = rendered;
                this.forceUpdate();
            })
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
                {child.then ? null : child}
            </Animated.View>
        );
    }
}


export default class Swiper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            x: new Animated.Value(0),
            index: 0,
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

    changePage(dx) {
        if (dx > 0) {

        }
    }

    renderPages() {
        let pages = [];
        for (i = this.state.index - 1; i <= this.state.index + 1; i++) {
            pages.push(this.props.renderPage(i));
        }
        return pages;
    }

    render() {
        let pages = this.renderPages();

        return (
            <View
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                {...this.panResponder.panHandlers}
            >
                <Page x={this.state.x}>
                    {pages[1]}
                </Page>
            </View>
        );
    }
}