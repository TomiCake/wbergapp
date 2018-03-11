import { StyleSheet } from 'react-native';
import { BGCOLOR_ACCENT } from '../const';

export default StyleSheet.create({
    listItem: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#DDDDDD",
    },
    listItemNameType: {
        flexDirection: 'column',
        flex:1
    },
    list: {
        backgroundColor: BGCOLOR_ACCENT,
    },
    flex: {
        flex: 1,
    },
    listItemName: {
        fontWeight: '900',
        color: 'white',
    },
    listItemType: {
        color: "#ddd"
    }
});