
import React, { Component } from 'react';

import { View, PanResponder, Animated, Dimensions } from 'react-native';


class Page extends Component {

    constructor(props) {
        super(props);

        this.props.page.page.update = this.loadRender.bind(this);
        this.props.page.page.loadSlaves = this.loadSlaves.bind(this);
        
    }

    componentDidMount() {
    }
    componentWillUnmount() {
        console.log("unmound" + this.props.page.page.index)
    }

    loadSlaves() {
        this.props.slave.forEach((slave) => slave.update && slave.update());
    }

    loadRender(force) {
        if (this.promise || !force && this.children) return;
        return this.promise = this.props.page.page.renderWeek(this.props.page.page.index)
            .then((rendered) => {
                this.children = rendered;
                this.promise = null;
                this.forceUpdate();
                console.log("rendered" + this.props.page.page.index);
            });
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
            let s = 200;
            return (
                <Animated.View style={[pageStyle, {
                    elevation: 0,
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
        if (!this.children && !this.promise) {
            this.loadRender()
                .then(() => this.props.slave.forEach((slave) => slave.update()))
        }

        return (
            <Animated.View style={[pageStyle, {
                elevation: 1,
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
                if (this.anim || this.locked) return false;
                if (Math.abs(gestureState.dx) >= 150 / Math.max(1, Math.abs(gestureState.vx * 0.7))) {
                    //this.changePage(gestureState.dx);
                    this.anim = Animated.spring(this.state.x, {
                        toValue: gestureState.dx > 0 ? Dimensions.get('window').width * 5 + 200 : - Dimensions.get('window').width * 5 - 200,
                        useNativeDriver: true
                    });
                    const s = gestureState.dx;
                    this.anim.start(() => {
                        
                    });
                    setTimeout(() => {
                        this.changePage(s);
                        this.state.x.setValue(0);
                        this.locked = true;
                        this.anim = null;
                    }, 1);

                    return false;
                }
                this.state.x.setValue(gestureState.dx);
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

    changePage(dx, callback) {
        if (dx < 0) {
            this.index++;
        } else {
            this.index--;
        }
        let newPages = [];
        for (i = this.index - 1; i <= this.index + 1; i++) {
            if (this.pages[i]) {
                newPages[i] = this.pages[i];
            } else {
                newPages[i] = { index: i, renderWeek: this.props.renderWeek };
            }
        }
        this.pages = newPages;
        this.forceUpdate(() => this.pages[this.index].loadSlaves());
    }

    renderPages() {
        for (i = this.index - 1; i <= this.index + 1; i++) {
            this.pages[i] = { index: i, renderWeek: this.props.renderWeek };
        }
    }

    updateCellPositions() {
        this.pages.forEach((page) => page.update && page.update(true))
    }

    render() {
        let page1 = this.pages[this.index - 1];
        let masterPage = this.pages[this.index];
        let page3 = this.pages[this.index + 1];
        return (
            <View
                style={{ position: 'absolute', height: '100%', width: '100%' }}
                {...this.panResponder.panHandlers}
            >

                <Page x={this.state.x} left key={page1.index} page={{ page: page1 }}
                >
                </Page>


                <Page x={this.state.x} right key={page3.index} page={{ page: page3 }}>
                </Page>

                <Page x={this.state.x}
                    slave={[page1, page3]}
                    key={masterPage.index}
                    page={{ page: masterPage }}>
                </Page>
            </View>
        );
    }
}