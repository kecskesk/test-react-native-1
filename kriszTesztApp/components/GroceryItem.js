import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default class GroceryItem extends React.Component {
    constructor(props) {
        super(props);
        this.item = props.itemData;
    }

    render() {
        return (
            <View style={styles.row}>
                <Button onPress={() => this.props.handleDelete(this.item._key)} title="del" disabled={this.props.disableDelete} />
                <Text style={[styles.cell, {color: this.item.color}]}>#{this.item.id}</Text>
                <Text style={[styles.cell, {color: this.item.color}]}>{this.item.name}</Text>
                <Text style={[styles.cell, {color: this.item.color}]}>{this.item._key}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cell: {
        margin: 10,
    },
    row: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#eeeeee',
        margin: 1,
        padding: 1,
    }
});
