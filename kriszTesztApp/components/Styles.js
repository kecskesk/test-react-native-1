import { StyleSheet, Dimensions  } from 'react-native';

let height = Dimensions.get('window').height;
let width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom:10
    },
    title: {
        padding: 10,
        flex: 1,
        fontStyle: 'italic',
        fontWeight: 'bold'
    },
    titleRow: {
        marginTop: 40,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    content: {
        flex: 9,
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noItemWrapper: {
        flex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noItem: {
        fontStyle: 'italic',
    },
    row: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    itemNameInput: {
        width: width,
        flex: 5,
        height: 40,
        padding: 5
    },
    actionButton: {
        margin: 1
    }
});

export default styles;