import React from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, Button, Alert } from 'react-native';
import * as firebase from 'firebase';
import styles from './Styles';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loggedIn: false};
    }

    login = () => {
        if (this.state.username && this.state.password && this.myRef) {
            firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password).then(result => {
                if (this.myRef) this.setState({result});
                if (this.myRef) this.setState({error: null});
            }).catch((error) => {
                if (this.myRef) this.setState({error});
                if (this.myRef) this.setState({result: null});
            });
        }
    };

    register = () => {
        if (this.state.username && this.state.password && this.myRef) {
            firebase.auth().createUserWithEmailAndPassword(this.state.username, this.state.password).then(result => {
                if (this.myRef) this.setState({result});
                if (this.myRef) this.setState({error: null});
            }).catch((error) => {
                if (this.myRef) this.setState({error});
                if (this.myRef) this.setState({result: null});
            });
        }
    };

    logout = () => {

        firebase.auth().signOut().then(result => {
            if (this.myRef) this.setState({result});
            if (this.myRef) this.setState({error: null});
        }).catch((error) => {
            if (this.myRef) this.setState({error});
            if (this.myRef) this.setState({result: null});
        });
    };

    componentDidMount() {
        this.listenForItems();
    }

    listenForItems() {
        try {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    // User is signed in.
                    this.displayName = user.displayName;
                    this.email = user.email;
                    this.emailVerified = user.emailVerified;
                    this.photoURL = user.photoURL;
                    this.isAnonymous = user.isAnonymous;
                    this.uid = user.uid;
                    this.providerData = user.providerData;

                    this.setState({loggedIn: true});
                } else {
                    this.setState({loggedIn: false});
                }
            });
        } catch (error) {
            this.errorHandler(error);
        }
    }

    render() {
        return (
            <View ref={(component) => {this.myRef = component}}>
                {this.state.error && <View>
                    <Text style={styles.error}>{this.state.error.code}</Text>
                    <Text style={styles.error}>{this.state.error.message}</Text>
                </View>}

                {this.state.loggedIn ?
                    <View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Name: </Text>
                            <Text style={styles.label}>{this.displayName}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Email: </Text>
                            <Text style={styles.label}>{this.email}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Verified: </Text>
                            <Text style={styles.label}>{this.emailVerified}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Photo url: </Text>
                            <Text style={styles.label}>{this.photoURL}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Anonymus: </Text>
                            <Text style={styles.label}>{this.isAnonymous}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>UID: </Text>
                            <Text style={styles.label}>{this.uid}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Provider data: </Text>
                            <Text style={styles.label}>{this.providerData.toString()}</Text>
                        </View>
                        <View style={styles.actionButton}>
                            <Button title="log out" onPress={this.logout} />
                        </View>

                    </View> :
                    <View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Username: </Text>
                            <TextInput placeholder='username' value={this.state.username}
                                       style={styles.textInput}
                                       onChangeText={(text) => {this.setState({username: text})}}/>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Password: </Text>
                            <TextInput placeholder='password' value={this.state.password}
                                       style={styles.textInput} secureTextEntry
                                       onChangeText={(text) => {this.setState({password: text})}}/>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.actionButton}>
                                <Button title="login" onPress={this.login} />
                            </View>
                            <View style={styles.actionButton}>
                                <Button title="register" onPress={this.register} />
                            </View>
                        </View>
                    </View>
                }
            </View>
        );
    }
}