import React, { Component } from 'react';

import { View, Text, ScrollView, Animated, TouchableWithoutFeedback, TouchableOpacity, TouchableNativeFeedback, TouchableHighlight, Dimensions, LayoutAnimation } from 'react-native';
import styles from './period.styles';

class TextA extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            toggle: new Animated.Value(1),
            text: props.children,
        };
    }
    toggle = false;

    render() {

        return (
            <Animated.Text
                style={[this.props.style, {
                    opacity: this.state.toggle,
                }]}>
                {this.state.text}
            </Animated.Text>
        );
    }

    componentWillReceiveProps(props) {
        if (this.props.children == props.children) {
            return;
        }
        
        Animated.timing(this.state.toggle, {
            toValue: 0.5,
            duration: 125,
            useNativeDriver: true,
        }).start(() => {
            this.setState({ text: props.children }, () => {
                Animated.timing(this.state.toggle, {
                    toValue: 1,
                    duration: 125,
                    useNativeDriver: true,
                }).start();
            });
        });
        

    }
}

export default class Period extends Component {


    renderLesson(type, lesson, i, horizontal, small) {
        if (type == "student") {
            var field1 = { ...lesson.subject };
            var field2 = { ...lesson.teacher };
            var field3 = { ...lesson.room };
        }
        if (lesson.substitutionType == "SUBSTITUTION") {
            field3.style = { color: 'green' };
        }


        if (!horizontal && small) {
            return (
                <View key={i} style={styles.row}>
                    <Text style={[styles.text, styles.bold, field1.style]} numberOfLines={1}>{field1.NAME}</Text>
                    <View>
                        <Text style={[styles.text, styles.small, styles.right, field2.style]}>{field2.NAME}</Text>
                        <Text style={[styles.text, styles.small, styles.right, field3.style]}>{field3.NAME}</Text>
                    </View>
                </View>)
        }
        if (!horizontal && !small) {
            return (
                <View key={i} style={styles.column}>
                    <View style={[styles.row, styles.flex]}>
                        <Text style={[styles.text, styles.bold, field1.style]} numberOfLines={1} >{field1.NAME}</Text>
                        <Text style={[styles.text, styles.right, field3.style]}>{field3.NAME}</Text>
                    </View>
                    <Text style={[styles.text, styles.middle, field2.style]} numberOfLines={1}>{field2.DESCRIPTION}</Text>
                </View>
            )
        }
        if (horizontal) {
            return (
                <View key={i} style={styles.row}>
                    <View style={[styles.column, styles.flex]}>
                        <Text style={[styles.text, styles.bold, field1.style]} numberOfLines={1} ellipsizeMode="middle">{field1.DESCRIPTION}</Text>
                        <Text style={[styles.text, styles.small, field2.style]}>{field2.DESCRIPTION}</Text>
                    </View>
                    <View>
                        <Text style={[styles.text, styles.right, field3.style]}>{field3.NAME}</Text>
                    </View>
                </View>
            )
        }
    }


    constructor(props) {
        super(props);

    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                {this.props.data.map((lesson, i) => (
                    this.renderLesson(this.props.type, lesson, i, this.props.horizontal, this.props.data.length > 1)
                ))}
            </View>
        );
    }
}