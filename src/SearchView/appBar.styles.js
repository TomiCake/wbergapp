import { StyleSheet } from 'react-native';
import { HEADER_BGCOLOR, BGCOLOR, BGCOLOR_ACCENT } from '../const';

export default StyleSheet.create({
    appBar: {
        flexDirection: 'row',
        height: 60,
        elevation: 1,
        paddingTop: 8,
        backgroundColor: HEADER_BGCOLOR,
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
        backgroundColor: BGCOLOR,
    },
    keyboardRow: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    key: {
        flex: 1,
        margin: 2,
        padding: 1,
        borderRadius: 2,
        borderColor: '#ccc',
        borderWidth: 0.5,
    },
    keyText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
    }
});