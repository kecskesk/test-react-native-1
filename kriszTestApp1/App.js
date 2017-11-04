import React from 'react';
import { StyleSheet, Text, View, FlatList, Button, Alert, TextInput, KeyboardAvoidingView  } from 'react-native';
import * as firebase from 'firebase';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {dataSource: []};
        this.itemsRef = firebaseApp.database().ref().child('items');

        console.ignoredYellowBox = [
            'Setting a timer'
        ];
    }

    getRandomColor = () => {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    addItem = () => {
        this.itemsRef.push({ color: this.getRandomColor(),
            id: this.state.dataSource.length + 1,
            name: this.state.itemName ?
              this.state.itemName : 'newName in ' + this.getRandomColor() }).then(() => {
                if(this.myFlatList) {
                    this.myFlatList.scrollToEnd();
                    this.setState({itemName: ''});
                }
              });
    };

    removeAllItems = () => {
        Alert.alert(
            'Remove all items',
            'Are you sure, you want to delete all items?',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => this.itemsRef.remove()},
            ],
            { cancelable: false }
          );
    };

    removeItem = (key) => {
        if (key && this.itemsRef.child(key)) {
            this.itemsRef.child(key).remove();
        }
    };

    componentDidMount() {
        this.listenForItems(this.itemsRef);
    }

    listenForItems(itemsRef) {
        try {
            itemsRef.on('value', (snap) => {

                // get children as an array
                let items = [];
                snap.forEach((child) => {
                    items.push({
                        color: child.val().color,
                        id: child.val().id,
                        name: child.val().name,
                        _key: child.key
                    });
                });

                this.setState({
                    dataSource: items
                });
            });
        } catch (error) {
            console.log(error.toString())
        }
    }

    renderListItem = (item) => {
        return (
            <View style={styles.listRow}>
                <Button style={styles.listCell} onPress={() => this.removeItem(item._key)} title="DEL" />
                <Text style={styles.listCell}>
                    {item.id}
                </Text>
                <Text style={[styles.listCell, {color: item.color}]}>
                    {item.name}
                </Text>
                <Text style={[styles.listCell, {color: item.color}]}>
                    (pszt: {item._key})
                </Text>
            </View>
        );
    };

    render() {
    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>

            <Text style={styles.title}>Grocery List</Text>

            <FlatList
                ref={(list) => this.myFlatList = list}
                data={this.state.dataSource}
                renderItem={({item}) => this.renderListItem(item)}
                keyExtractor={(item, index) => index}/>

            <View style={styles.addRow}>
                <TextInput
                  value={this.state.itemName}
                  style={[styles.listCell, styles.itemNameInput]}
                  placeholder="name for new item"
                  onChangeText={(text) => this.setState({itemName: text})}/>

                  <View style={[styles.listCell, styles.actionButton]} >
                    <Button onPress={this.addItem} title="add" />
                  </View>
                  <View style={[styles.listCell, styles.actionButton]} >
                    <Button onPress={this.removeAllItems} title="empty" />
                  </View>
            </View>
        </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10
    },
    title: {
      fontStyle: 'italic',
      marginTop: 40,
      marginBottom: 10
    },
    itemNameInput: {
      flex: 5,
      height: 40,
      padding: 5
    },
    listRow: {
        flex: 1,
        flexDirection: 'row',
        margin: 1,
        padding: 4,
        borderWidth: 1,
        borderColor: 'black'
    },
    actionButton: {
      margin: 1,

    },
    listCell: {
        margin: 10
    },
    addRow: {
      flexDirection: 'row',
      height: 50,
      alignItems: 'center',
      justifyContent: 'center'
    }
});

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA2Yo90FmR-Er7A0wuoiE74gscbdmq8-ck",
    authDomain: "aef1-423ad.firebaseapp.com",
    databaseURL: "https://aef1-423ad.firebaseio.com",
    projectId: "aef1-423ad",
    storageBucket: "aef1-423ad.appspot.com",
    messagingSenderId: "800775522142"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
