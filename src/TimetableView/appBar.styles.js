import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    appBar: {
        flexDirection: 'column',
        height: 60,
        backgroundColor: '#1976D2',
    },
    firstRow: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        paddingTop: 4,
        paddingHorizontal: 8,
    },
    loadingBar: {

    },
    flex: {
        flex: 1,
    },
    column: {
        flexDirection: 'column',
    },
    subtitle: {
        color: 'white',
        fontSize: 12,
    },
    title: {
        color: 'white',
        fontSize: 22,
    },
    buttons: {
        flexDirection: 'row'
    },
    button: {
        margin: 10,
    }
});