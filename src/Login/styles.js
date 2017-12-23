import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    error: {
        marginTop: 10,
        // marginVertical: 20,
        // backgroundColor: 'red',
        // padding: 20,
    },
    cardHeader: {
        alignItems: 'center'
    },
    card: {
        backgroundColor: '#FFFFFFE0',
        padding: 20,
        
        margin: 20,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 1,
        shadowRadius: 16.00,

        elevation: 12,
    },
    title: {
        fontSize: 38,
        backgroundColor: 'transparent'
    },
    input: {
        height: 40,
        marginBottom: 20,
        paddingHorizontal: 10
    },
    button: {
        marginRight: 10
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    backgroundImage: {
        justifyContent: 'center',
        resizeMode: 'cover',
        flex: 1,
        width: null
    }
});

export default styles;