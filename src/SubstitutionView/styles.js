import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#212121',
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    table: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#1b1b1b',
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
        
    }
});