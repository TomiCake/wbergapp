import React, { Component } from 'react';
import { View, Text, Animated } from 'react-native';
import styles from './styles';
import moment from 'moment';
import Swiper from './Swiper';

import { WEEKDAY_NAMES } from '../../const';
import { getPeriodTimes } from '../common/periodTimes';

export default class Grid extends Component {

    cellPositions = [[], [], [], [], []];
    constructor(props) {
        super(props);
        this.state = { animatedValue: new Animated.Value(0) };
    }

    // setLayout(x, y) {
    //     return (layout) => {
    //         this.cellPositions[x - 1][y - 1] = {
    //             left: (x - 1) * layout.nativeEvent.layout.width + 40,
    //             top: layout.nativeEvent.layout.y,
    //             width: layout.nativeEvent.layout.width - 1,
    //             height: layout.nativeEvent.layout.height - 1,
    //         };
    //         this.props.onLayout();
    //     }
    // }

    renderColumn(i) {
        return (
            <View key={i} style={[styles.column]}>

                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((y) => this.renderCell(i, y))}
            </View>
        );
    }

    renderHeaderRow() {
        return (
            <View style={[styles.accent]}>
                <Animated.View style={[styles.row, {
                    transform: [
                        {
                            translateX: this.state.animatedValue.interpolate({
                                inputRange: [0, 20],
                                outputRange: [0, 1],
                            })
                        }
                    ],
                    opacity: this.state.animatedValue.interpolate({
                        inputRange: [-100, 0, 100],
                        outputRange: [0.5, 1, 0.5],
                    })
                }]}>
                    <View key={10} style={[styles.headerCell, { flex: 0, backgroundColor: null }]}></View>
                    {WEEKDAY_NAMES.map((name, i) => (
                        <View key={i} style={[styles.headerRowCell]}>

                            <Text style={styles.weekday} numberOfLines={1}>
                                {name}
                            </Text>
                            <Text style={styles.weekday} numberOfLines={1}>
                                {moment(this.props.monday).add(i - 1, 'days').format(" DD.MM")}
                            </Text>
                        </View>
                    ))}
                </Animated.View>
            </View>
        );
    }

    renderHeaderColumn(i) {
        return (
            <View key={i} style={[styles.column, styles.headerColumn]}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(this.renderTimeCell.bind(this))}
            </View>
        )
    }

    renderTimeCell(i) {
        let periodTimes = getPeriodTimes(i - 1, this.props.secondary);
        return (
            <View key={i} style={[styles.headerCell, i % 2 == 0 ? styles.accent : null]}>
                <Text style={styles.period}>{i}</Text>
                <Text style={styles.time}>{periodTimes.start}</Text>
                <Text style={styles.time}>{periodTimes.end}</Text>
            </View>
        )
    }
    renderCell(x, y) {
        return (
            <View key={y} style={[styles.cell, y % 2 == 0 ? styles.accent : null]}>
            </View>
        );
    }

    updateCellPositions() {
        this.refs.swiper.updateCellPositions();
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeaderRow()}
                <View style={styles.grid}>
                    {this.renderHeaderColumn(0)}
                    <View style={styles.grid} onLayout={this.props.onLayout}>
                        {[1, 2, 3, 4, 5].map((i) => this.renderColumn(i))}
                        <Swiper
                            ref="swiper"    
                            animatedValue={this.state.animatedValue}
                            renderWeek={this.props.renderWeek}>

                        </Swiper>
                    </View>
                </View>
            </View>
        );
    }
}