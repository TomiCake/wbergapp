import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    error: {
        marginTop: 10,
    },

    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 16,
    },
    cardContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#FFFFFFEF',
        // margin: 20,
        // borderRadius: 2,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 12,
        // },
        // shadowOpacity: 1,
        // shadowRadius: 16.00,
        
        // elevation: 1,
        flex: 1,
        maxWidth: 500,
    },
    flex: {
        flex: 1
    },
    row: {
        flexDirection: 'row',
    },
    input: {
        height: 40,
        marginBottom: 20,
        paddingHorizontal: 10
    },
    button: {
        marginRight: 10
    },
    backgroundContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    backgroundImage: {
        justifyContent: 'center',
        resizeMode: 'cover',
        flex: 1,
        width: null
    }
});

export default styles;