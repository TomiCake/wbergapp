import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    appBar: {
        flexDirection: 'row',
        height: 60,
        elevation: 1,
        paddingTop: 8,
        backgroundColor: '#1976D2',
    },
    button: {
        margin: 10,
    },
    textInput:{
        flex:1,
        color: 'white'
    },
    keyboard: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    keyboardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    key: {
        flex: 1,
    },
    keyText: {
        color: 'black',
        fontSize: 20,

        textAlign: 'center',
    }
});