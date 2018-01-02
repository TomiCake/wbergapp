import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

export default class GridA extends Component {

    cellPositions = [[], [], [], [], []];

    componentDidMount() {
        if (this.props.onCellLayout) {
            this.props.onCellLayout(this.cellPositions);
        }
    }

    renderColumn(i) {
        return (
            <View key={i} style={[styles.column]}>
                <View key={0} style={styles.headerRowCell}>
                    <Text style={styles.weekday} numberOfLines={1}>
                        {['', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'][i]}
                    </Text>
                </View>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((y) => this.renderCell(i, y))}
            </View>
        );
    }

    renderHeaderColumn(i) {
        return (
            <View key={i} style={[styles.column, styles.headerColumn]}>
                <View key={0} style={styles.headerRowCell}><Text> </Text></View>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(this.renderTimeCell)}
            </View>
        )
    }

    renderTimeCell(i) {
        return (
            <View key={i} style={styles.headerCell}>
                <Text>{i}</Text>
                <Text style={styles.time}>8:45</Text>
                <Text style={styles.time}>8:00</Text>
            </View>
        )
    }

    renderCell(x, y) {
        return (
            <View key={y} style={[styles.cell, y % 2 == 0 ? styles.accent : null]}
                onLayout={(layout) => this.cellPositions[x - 1][y - 1] = layout.nativeEvent.layout}>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.grid}>
                {this.renderHeaderColumn(0)}
                {[1, 2, 3, 4, 5].map((i) => this.renderColumn(i))}

            </View>
        );
    }
}
