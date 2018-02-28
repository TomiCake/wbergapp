import { StyleSheet } from 'react-native';

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
    flex: {
        flex: 1,
    },
    listItemName: {
        fontWeight: '900'
    },
    listItemType: {
        color: "#666666"
    }
});