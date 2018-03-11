import { StyleSheet } from 'react-native';
import { HEADER_BGCOLOR, BGCOLOR, BGCOLOR_ACCENT } from '../const';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BGCOLOR,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    table: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: BGCOLOR_ACCENT,
    },
    text: {
        color: 'white',

    },
    substitutionEntry: {
        backgroundColor: '#3e2723',
        borderRadius: 2,
        padding: 5,
        margin: 2,
    },
    substitutionText: {
        fontSize: 10,
        color: 'white',
        textAlign: 'center',
    },
    flex: {
        flex: 1,
    },
    holidayText: {
        color: 'lime',
    },
    row: {
        flexDirection: 'row',
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        backgroundColor: HEADER_BGCOLOR,
        elevation: 3,
    },
    headerText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 20,
    },
    dateText: {
        color: 'white',
        textAlign: 'right',
        fontSize: 12,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    flex: {
        flex: 1,
    },
});