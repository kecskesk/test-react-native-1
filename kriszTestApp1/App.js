import React from 'react';
import { StyleSheet, Text, View, FlatList, Button, Alert } from 'react-native';
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
        this.itemsRef.push({ color: this.getRandomColor(), id: this.state.dataSource.length + 1, name: 'newName in ' + this.getRandomColor() });
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

    render() {
    return (
        <View style={styles.container}>

            <Text style={styles.title}>Grocery List</Text>

            <FlatList
                data={this.state.dataSource}
                renderItem={({item}) => <Text style={{color: item.color}}>* {item.id} * {item.name} (pszt: {item._key})</Text>}
                keyExtractor={(item, index) => index}/>

            <Button onPress={this.addItem} title="Add" />

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
      marginBottom:30
  },
    title: {
      marginTop:30
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