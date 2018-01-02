import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    column: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
    },
    cell: {
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderColor: '#bbdefb',
        backgroundColor: '#e1f5fe',
        flex: 1,
    },
    headerColumn: {
        flex: 0,
        
    },
    grid: {
        flexDirection: 'row',
        flex: 1,
        height: '100%',
    },
    headerCell: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#b3e5fc',
        alignItems: 'center'
    },
    weekday: {
        fontSize: 12,
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center'
    },

    headerRowCell: {
        height: 30,
        backgroundColor: '#b3e5fc',
        padding: 5,
        justifyContent: 'center'
    },

    time: {
        fontSize: 7
    },
    
    accent: {
        backgroundColor: '#d8ebf4'
    },

    container: {
        flex: 1,
    },
    periodNumbers: {
        alignItems: 'center',

        flexDirection: 'column',
    }
});
