import React from 'react';
import { Text, TextInput, View, FlatList, Button, Alert, KeyboardAvoidingView } from 'react-native';
import * as firebase from 'firebase';
import GroceryList from './components/GroceryList';
import Profile from './components/Profile';
import styles from './components/Styles';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {view: PROFILE_VIEW};
        this.ref = firebaseApp.database().ref();

        console.ignoredYellowBox = [
            'Setting a timer'
        ];
    }

    goToProfile = () => {
        this.setState({view : PROFILE_VIEW});
    };

    goToList = () => {
        this.setState({view : LIST_VIEW});
    };

    render() {
        return (
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <View style={[styles.titleRow]}>
                    <Text style={[styles.title]}>{this.state.view}</Text>
                    <View style={[styles.actionButton]}>
                        {this.state.view === PROFILE_VIEW ?
                            <Button onPress={this.goToList} title="list"/> :
                            <Button onPress={this.goToProfile} title="profile"/>}
                    </View>
                </View>

                <View style={[styles.content]}>
                    {this.state.view === PROFILE_VIEW ?
                        <Profile /> :
                        <GroceryList firebaseRef={this.ref} />}
                </View>
            </KeyboardAvoidingView>
        );
    }
}

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

const PROFILE_VIEW = 'My profile';
const LIST_VIEW = 'Grocery list';