import { StyleSheet } from 'react-native';

export const templates = {
    "student": ["subject", "teacher", "room"],
    "teacher": ["subject", "classes", "room"]
};

export default StyleSheet.create({
    container: {
        position: 'absolute',
        borderRadius: 2,   
        padding: 0,
        margin: 0,
    },
    contentContainer: {
        padding: 5,
    },
    text: {
        fontSize: 11,
        flex: 1,
        color: 'white'
    },
    bold: {
        fontWeight:'bold'
    },
    middle: {
        fontSize:10
    },
    small: {
        fontSize:9
    },
    center: {
        textAlign: 'center'
    },
    right: {
        textAlign: 'right'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        
    },
    
    column: {
        flexDirection: 'column',
    },
    flex: {
        flex: 1
    }
});
