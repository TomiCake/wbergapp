
import React, { Component } from 'react';

import { View, PanResponder, Animated, Dimensions } from 'react-native';



class Page extends Component {

    constructor(props) {
        super(props);
        this.props.page.page.update = this.loadRender.bind(this);
    }
    renderChildren() {
        return this.props.children;
    }

    render() {
        let pageStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',

        };
        if (this.props.right || this.props.left) {
            const space = 100;
            return (
                <Animated.View style={[pageStyle, {
                    elevation: 0,
                    transform: [
                        {
                            translateX: this.props.x.interpolate({
                                inputRange: [-2, -0.1, 0.1, 2],
                                outputRange: [0, space, -space, 0],
                            })
                        }
                    ],
                    opacity: this.props.x.interpolate({
                        inputRange: [-2, -0.1, 0.1, 2],
                        outputRange: [this.props.right ? 1 : 0, 0, 0, this.props.left ? 1 : 0],
                    })
                }]}>
                    {this.renderChildren()}
                </Animated.View>
            );
        }



        return (
            <Animated.View style={[pageStyle, {
                elevation: 1,
                transform: [
                    {
                        translateX: this.props.x.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 50],
                        })
                    }
                ],
                opacity: this.props.x.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [0.5, 1, 0.5],
                })
            }]}>
                {this.renderChildren()}
            </Animated.View>
        );
    }
}

class PromisePage extends Page {

    constructor(props) {
        super(props);

    }

    loadRender(force) {
        if (this.promise || !force && this.children) {
            if (this.props.slaves) {
                this.props.slaves.forEach((slave) => slave.update(force));
            }
            return;
        }
        return this.promise = this.props.renderContent(this.props.page.page.index)
            .then((rendered) => {
                this.children = rendered;
                this.promise = null;
                this.forceUpdate();
                console.log("rendered" + this.props.page.page.index);
                if (this.props.slaves) {
                    this.props.slaves.forEach((slave) => slave.update(force));
                }
            });
    }

    renderChildren() {
        return this.children;
    }

    render() {
        if (!(this.props.left || this.props.right) && !this.children && !this.promise) {
            this.loadRender();
        }
        return super.render();
    }
}

export default class Swiper extends Component {

    constructor(props) {
        super(props);
        this.setIndex(this.index);
        this.state = {
            x: new Animated.Value(0),
        }

        this.panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => false,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
                Math.abs(gestureState.dy) < 10 && Math.abs(gestureState.dx) > 10,

            onPanResponderGrant: (evt, gestureState) => {
                // The gesture has started. Show visual feedback so the user knows
                // what is happening!
                console.log("onPanResponderGrant");

                // gestureState.d{x,y} will be set to zero now
            },
            onPanResponderMove: (evt, gestureState) => {
                if (this.locked) return false;
                if (Math.abs(gestureState.dx) >= 150 / Math.max(1, Math.abs(gestureState.vx * 0.7))) {
                    //this.changePage(gestureState.dx);

                    this.locked = true;
                    if (this.anim) {
                        this.anim.stop();
                    }
                    const anim = this.anim = Animated.spring(this.state.x, {
                        toValue: gestureState.dx > 0 ? 2 : - 2,
                        useNativeDriver: true
                    });
                    const s = gestureState.dx;

                    this.anim.start(() => {
                        if (anim === this.anim) {
                            this.state.x.setValue(0);
                            this.changePage(s);
                            this.anim = null;
                        }
                    });
                    return false;
                }
                this.state.x.setValue(gestureState.dx / 200);
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                this.locked = false;
                if (!this.anim) {
                    this.anim = Animated.spring(this.state.x, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
                console.log("onPanResponderTerminate");
                this.locked = false;
                if (!this.anim) {
                    this.anim = Animated.spring(this.state.x, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                console.log("onShouldBlockNativeResponder");
                return false;
            },
        });
    }

    index = 1;
    pages = [];
    masterPage;

    changePage(dx, callback) {
        if (dx < 0) {
            this.index++;
        } else {
            this.index--;
        }
        this.setIndex(this.index);
        this.forceUpdate(() => this.masterPage.update());
    }

    setIndex(index) {
        let newPages = [];
        for (i = index - 1; i <= index + 1; i++) {
            if (this.pages[i]) {
                newPages[i] = this.pages[i];
            } else {
                newPages[i] = { index: i };
            }
        }
        this.pages = newPages;
        this.masterPage = newPages[index];
        this.masterPage.slaves = newPages.slice().splice(index);
    }

    updatePages() {
        this.masterPage.update(true);
    }

    render() {
        let left = this.pages[this.index - 1];
        let right = this.pages[this.index + 1];
        return (
            <View
                style={{ position: 'absolute', height: '100%', width: '100%' }}
                {...this.panResponder.panHandlers}
            >
                <PromisePage x={this.state.x} left key={left.index} page={{ page: left }} renderContent={this.props.renderContent} />
                <PromisePage x={this.state.x} right key={right.index} page={{ page: right }} renderContent={this.props.renderContent} />
                <PromisePage x={this.state.x}
                    slaves={[left, right]}
                    key={this.masterPage.index}
                    page={{ page: this.masterPage }} renderContent={this.props.renderContent} />
            </View>
        );
    }
}