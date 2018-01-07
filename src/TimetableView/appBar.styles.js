import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    appBar: {
        flexDirection: 'row',
        height: 40,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignItems: 'center',
        backgroundColor: '#002171',
        elevation: 1,
    },
    title: {
        flex: 1,
        color: 'white',
        fontSize: 17,
    },
    buttons: {
        flexDirection: 'row'
    }
});