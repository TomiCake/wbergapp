import React, { Component } from 'react';
import { View, Text, Animated } from 'react-native';
import styles from './styles';
import moment from 'moment';
import Swiper from './Swiper';
import GridBox from './GridBox';

import { WEEKDAY_NAMES, PERIOD_NUMBERS, DATES_HEIGHT } from '../const';
import { getPeriodTimes } from '../common/periodTimes';

export default class Grid extends Component {

    constructor(props) {
        super(props);
    }
    
    renderColumn(i) {
        return (
            <View key={i} style={[styles.column]}>
                {this.renderHeaderSpacing()}
                {PERIOD_NUMBERS.map((y) => this.renderCell(i, y))}
            </View>
        );
    }

    renderHeaderRow(page) {
        return (
            <View style={[styles.row]}>
                {WEEKDAY_NAMES.map((name, i) => (
                    <View key={i} style={[styles.headerRowCell]}>

                        <Text style={styles.weekday} numberOfLines={1}>
                            {name}
                        </Text>
                        <Text style={styles.weekday} numberOfLines={1}>
                            {page.date.clone().add(i, 'days').format("DD.MM")}
                        </Text>
                    </View>
                ))}
            </View>
        );
    }

    renderHeaderSpacing() {
        return (
            <View style={[{ height: DATES_HEIGHT }, styles.accent]} />
        );
    }

    renderHeaderColumn(i) {
        return (
            <View key={i} style={[styles.column, styles.headerColumn]}>
                {this.renderHeaderSpacing()}
                {PERIOD_NUMBERS.map(this.renderTimeCell.bind(this))}
            </View>
        )
    }

    renderTimeCell(i) {
        let periodTimes = getPeriodTimes(i, this.props.secondary);
        return (
            <View key={i} style={[styles.headerCell, i % 2 == 1 ? styles.accent : null]}>
                <Text style={styles.period}>{i}</Text>
                <Text style={styles.time}>{periodTimes.start}</Text>
                <Text style={styles.time}>{periodTimes.end}</Text>
            </View>
        );
    }
    renderCell(x, y) {
        return (
            <View key={y} style={[styles.cell, y % 2 == 1 ? styles.accent : null]}>
            </View>
        );
    }

    updatePages() {
        this.refs.swiper.updatePages();
    }

    updateDate(date) {
        this.refs.swiper.updateDate(date);
    }

    render() {
        return (
            <View style={[styles.container, styles.grid]}>
                {this.renderHeaderColumn(0)}
                <View style={styles.grid}>
                    {[1, 2, 3, 4, 5].map((i) => this.renderColumn(i))}
                    <Swiper
                        ref="swiper"
                        renderContent={this.props.renderWeek}
                        renderHeaderRow={this.renderHeaderRow.bind(this)}
                        startDate={this.props.startDate}
                        minIndex={0}
                        maxIndex={10}
                        hasPanResponder={this.props.hasPanResponder}
                    >
                    </Swiper>
                </View>
            </View>
        );
    }
}