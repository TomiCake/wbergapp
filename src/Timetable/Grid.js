import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import moment from 'moment';

import { WEEKDAY_NAMES } from '../../const';
import { getPeriodTimes } from '../common/periodTimes';

export default class Grid extends Component {

    cellPositions = [[], [], [], [], []];

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
            <View style={styles.row}>
                <View key={10} style={[styles.headerCell, { flex: 0 }, styles.accent]}></View>
                {WEEKDAY_NAMES.map((name, i) => (
                    <View key={i} style={[styles.headerRowCell, styles.accent]}>
                        <Text style={styles.weekday} numberOfLines={1}>
                            {name}
                        </Text>
                        <Text style={styles.weekday} numberOfLines={1}>
                            {moment(this.props.monday).add(i - 1, 'days').format(" DD.MM")}
                        </Text>
                    </View>
                ))}
            </View>);
    }

    renderHeaderColumn(i) {
        return (
            <View key={i} style={[styles.column, styles.headerColumn]}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(this.renderTimeCell.bind(this))}
            </View>
        )
    }

    renderTimeCell(i) {
        let periodTimes = getPeriodTimes(i-1, this.props.secondary);
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

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeaderRow()}
                <View style={styles.grid} onLayout={this.props.onLayout}>
                    {this.renderHeaderColumn(0)}
                    {[1, 2, 3, 4, 5].map((i) => this.renderColumn(i))}
                </View>
            </View>
        );
    }
}
