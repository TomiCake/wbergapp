import React, { Component } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import styles from './styles';
import { WEEKDAY_NAMES, PERIOD_NUMBERS } from '../../const';
import PeriodNumber from './PeriodNumber';
import { rangeArray, rangeArrayDebug } from '../common/commonHelper';



export default class WeekView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            periodNumbers: PERIOD_NUMBERS.map(period => {
                return { period, animatedValue: new Animated.Value(50) };
            }),
            layout: null
        }
    }
    render() {
        const amount = this.props.amount - 1;
        const max = 4;
        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    {rangeArray(amount).map((i) => (
                        <Text key={i}>{WEEKDAY_NAMES[i]}</Text>
                    ))}
                </View>
                <ScrollView contentContainerStyle={styles.row}>
                    <View style={styles.periodNumbers}>
                        {this.state.periodNumbers.map((period, i) => (
                            <PeriodNumber key={i} style={{ height: period.animatedValue, justifyContent: 'center' }}>{period.period}</PeriodNumber>
                        ))}
                    </View>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        onLayout={(layout) => this.setState({ layout: { width: layout.nativeEvent.layout.width } })}
                    >
                        {rangeArray(Math.floor(max / (amount + 1))).map((page) =>
                            <View key={page} style={this.state.layout}>
                                <View style={styles.row}>
                                    {rangeArray(amount + page * (amount + 1), page * (amount + 1)).map(day => (

                                        <View key={day} style={[styles.column, styles.container]}>

                                            {this.state.periodNumbers.map((period, i) => (
                                                <View key={i}>
                                                    {day < 5 &&
                                                        this.props.renderLesson(period.period, day + 1)
                                                    }
                                                </View>

                                            ))}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </ScrollView>
                </ScrollView>
            </View>
        );
    }
}