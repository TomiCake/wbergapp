import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    appBar: {
        flexDirection: 'column',
        height: 60,
        elevation: 1,
    },
    firstRow: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 4,
        paddingHorizontal: 8,
        backgroundColor: '#1976D2',
    },
    loadingBar: {

    },
    title: {
        flex: 1,
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