import React from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, Button, Alert } from 'react-native';
import GroceryItem from './GroceryItem';
import * as firebase from 'firebase';
import styles from './Styles';

export default class GroceryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {dataSource: [], ids: []};
        this.itemsRef = this.props.firebaseRef.child('items');
        this.idRef = this.props.firebaseRef.child('id');
    }

    componentDidMount() {
        this.listenForItems(this.itemsRef, this.idRef);
    }

    listenForItems(itemsRef, idRef) {
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

                if (this.myRef) {
                    this.setState({
                        dataSource: items
                    });
                }
            });

            idRef.on('value', (snap) => {
                if (this.myRef && snap.val() && snap.val().uniqueId) {
                    this.setState({ uniqueId: snap.val().uniqueId });
                }
            });

            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    this.setState({loggedIn: true});
                } else {
                    this.setState({loggedIn: false});
                }
            });
        } catch (error) {
            this.errorHandler(error);
        }
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
        let uniqueId = 21;
        if (this.state.uniqueId) {
            uniqueId = this.state.uniqueId;
        }
        this.idRef.child('uniqueId').set(uniqueId + 1);

        this.itemsRef.push({
            color: this.getRandomColor(),
            id: uniqueId,
            name: this.state.itemName && this.state.itemName.length ?
                this.state.itemName : 'newName in ' + this.getRandomColor() })
        .then(() => {
            if (this.flatList) {
                this.flatList.scrollToEnd();
                if (this.myRef) {
                    this.setState({itemName: ''});
                }
            }
        }).catch(error => this.errorHandler(error));
    };

    deleteItem = (key) => {
        this.itemsRef.child(key).remove().catch(error => this.errorHandler(error));
    };

    emptyList = () => {
        Alert.alert('Empting the list', 'Are you sure you want to remove all items?',
            [ {text: 'Cancel', style: 'cancel'}, {text: 'OK', onPress: () => this.itemsRef.remove().catch(error => this.errorHandler(error))} ],
            { cancelable: false });
    };

    errorHandler = (error) => {
        if (error && error.code) {
            Alert.alert(error.code, error.message);
        } else {
            Alert.alert('An unknown error uccured', error.toString());
            console.log(error);
        }
    };

    render() {
        return (
            <View ref={(component) => {this.myRef = component}}>
                {this.state.dataSource.length ?
                    <FlatList
                        ref={(list) => {this.flatList = list}}
                        data={this.state.dataSource}
                        renderItem={({item}) => <GroceryItem itemData={item} handleDelete={this.deleteItem} disableDelete={!this.state.loggedIn}/>}
                        keyExtractor={(item, index) => item._key}/>
                    :
                    <View style={styles.noItemWrapper}>
                        <Text style={styles.noItem}>-- there is no item in the list --</Text>
                    </View>}

                <View style={styles.row}>
                    <TextInput placeholder='new item name' value={this.state.itemName}
                               style={styles.textInput}
                               onChangeText={(text) => {this.setState({itemName: text})}}/>
                    <View style={styles.actionButton}>
                        <Button onPress={this.addItem} title="add" disabled={!this.state.loggedIn} />
                    </View>
                    <View style={styles.actionButton}>
                        <Button onPress={this.emptyList} title="empty" disabled={!this.state.loggedIn} />
                    </View>
                </View>
            </View>
        );
    }
}