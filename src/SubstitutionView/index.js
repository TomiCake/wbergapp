import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import Header from './Header';
import styles from './styles';

const colorMap = {
    "SUBSTITUTION": "red",
    "ASSIGNMENT": "yellow",
    "ELIMINATION": "lime",
    "ROOM_SUBSTITUTION": "cyan",
    "SWAP": "gold",
    "EXTRA_LESSON": "fuchsia",
    "SUPERVISION": "grey",
};
const typeMap = {
    "ELIMINATION": "Entfall",
    "ROOM_SUBSTITUTION": "Raumvertretung",
    "ASSIGNMENT": "Aufgaben",
    "SUBSTITUTION": "Vertretung",
    "SWAP": "Tausch",
    "EXTRA_LESSON": "Zusatzstunde",
    "SUPERVISION": "Mitbetreuung",
};

function SubstitutionEntry(props) {

    return (
        <View style={styles.substitutionEntry}>
            <Text style={styles.text}>{props.classes}</Text>
            <View>
                {props.substitutions ? props.substitutions.map((substitution, i) => {
                    const textStyle = {
                        color: colorMap[substitution.substitutionType] || 'white'
                    };
                    return (
                        <View key={i} style={styles.row}>
                            <View>
                                <Text style={[styles.substitutionText, textStyle]}>
                                    {substitution.period}
                                </Text>
                            </View>

                            <View style={[styles.row, styles.flex]}>
                                <View style={styles.flex}>
                                    <Text style={[styles.substitutionText, textStyle]}>
                                        {substitution.subjectNew && substitution.subjectNew.NAME}
                                    </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <Text style={[styles.substitutionText, textStyle]}>
                                        {substitution.teacherNew && substitution.teacherNew.FIRSTNAME[0] + ". " + substitution.teacherNew.LASTNAME}
                                    </Text>
                                </View>
                                <View style={styles.flex}>
                                    <Text style={[styles.substitutionText, textStyle]}>
                                        {substitution.roomNew && substitution.roomNew.NAME}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.flex}>
                                <Text style={[styles.substitutionText, textStyle]}>
                                    {typeMap[substitution.substitutionType] || substitution.substitutionType}
                                </Text>
                            </View>
                            <View style={styles.flex}>
                                <Text style={[styles.substitutionText, textStyle]}>
                                    {substitution.text}
                                </Text>
                            </View>

                        </View>
                    );
                })
                    : <Text style={styles.holidayText}>{props.holiday}</Text>
                }
            </View>
        </View>
    );
}


export default class SubstitutionView extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillReceiveProps(props) {
        if (props.substitutions) {
            this.setState({ data: this.parse(props) });
        }
    }

    parse(props) {
        let data = {};
        let day = props.date.isoWeekday();
        if (day > 5) return null;
        let masterdata = props.masterdata;
        let subs = props.substitutions[day];
        if (!subs) return null;
        subs.substitutions.forEach((substitution) => {
            let entry = data[substitution.CLASS_IDS];
            if (!entry) {
                let classes = substitution.CLASS_IDS.split(',').map((key) => masterdata.Class[key].NAME).join(',');
                entry = data[substitution.CLASS_IDS] = { substitutions: [], classes: classes };
            }
            entry.substitutions.push(this.translate(masterdata, substitution));
        });
        data = Object.values(data).sort((o1, o2) => o1.classes.localeCompare(o2.classes));
        data.forEach((e) => e.substitutions.sort((o1, o2) => o1.period - o2.period));
        return data;
    }

    translate(masterdata, substitution) {
        return {
            period: substitution.PERIOD,
            text: substitution.TEXT,
            substitutionType: substitution.TYPE,
            teacher: masterdata.Teacher[substitution.TEACHER_ID],
            subject: masterdata.Subject[substitution.SUBJECT_ID],
            room: masterdata.Room[substitution.ROOM_ID],
            teacherNew: masterdata.Teacher[substitution.TEACHER_ID_NEW],
            subjectNew: masterdata.Subject[substitution.SUBJECT_ID_NEW],
            roomNew: masterdata.Room[substitution.ROOM_ID_NEW],
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Header date={this.props.date}/>    
                <ScrollView style={styles.table}>
                    {this.state.data && this.state.data.map((substitution, i) => (
                        <SubstitutionEntry
                            key={i}
                            {...substitution}
                        />
                    ))}
                </ScrollView>
            </View>
        );
    }
}