import React from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, Button, Alert } from 'react-native';
import GroceryItem from './GroceryItem';
import styles from './Styles';

export default class GroceryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {dataSource: []};
        this.itemsRef = this.props.firebaseRef;
    }

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

                if (this.myRef) {
                    this.setState({
                        dataSource: items
                    });
                }
            });
        } catch (error) {
            console.log(error.toString())
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
        this.itemsRef.push({
            color: this.getRandomColor(),
            id: this.state.dataSource.length + 1,
            name: this.state.itemName && this.state.itemName.length ?
                this.state.itemName : 'newName in ' + this.getRandomColor() })
        .then(() => {
            if (this.flatList) {
                this.flatList.scrollToEnd();
                if (this.myRef) {
                    this.setState({itemName: ''});
                }
            }
        });
    };

    deleteItem = (key) => {
        this.itemsRef.child(key).remove();
    };

    emptyList = () => {
        Alert.alert('Empting the list', 'Are you sure you want to remove all items?',
            [ {text: 'Cancel', style: 'cancel'}, {text: 'OK', onPress: () => this.itemsRef.remove()} ],
            { cancelable: false });
    };

    render() {
        return (
            <View ref={(component) => {this.myRef = component}}>
                {this.state.dataSource.length ?
                    <FlatList
                        ref={(list) => {this.flatList = list}}
                        data={this.state.dataSource}
                        renderItem={({item}) => <GroceryItem itemData={item} handleDelete={this.deleteItem} />}
                        keyExtractor={(item, index) => item._key}/>
                    :
                    <View style={styles.noItemWrapper}>
                        <Text style={styles.noItem}>-- there is no item in the list --</Text>
                    </View>}

                <View style={styles.row}>
                    <TextInput placeholder='new item name' value={this.state.itemName}
                               style={styles.itemNameInput}
                               onChangeText={(text) => {this.setState({itemName: text})}}/>
                    <View style={styles.actionButton}>
                        <Button onPress={this.addItem} title="add"/>
                    </View>
                    <View style={styles.actionButton}>
                        <Button onPress={this.emptyList} title="empty"/>
                    </View>
                </View>
            </View>
        );
    }
}