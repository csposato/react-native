import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator } from 'react-navigation-stack';
import {
    ActivityIndicator,
    Text,
    Button,
    StatusBar,
    StyleSheet,
    View
} from 'react-native';

class SignInScreen extends React.Component {
    static navigationOptions = {
        title: 'Please sign in',
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    The title and onPress handler are required. It is recommended to set
                    accessibilityLabel to help make your app usable by everyone.
                </Text>
                <Button
                    title="Login"
                    onPress={this._signInAsync}
                />
            </View>
            /*
            <View style={styles.container}>
                <Button title="Sign in!" onPress={this._signInAsync} />
            </View>
            */
        );
    }

    _signInAsync = async () => {
        try {
            await AsyncStorage.setItem('userToken', 'abc');
            const userToken = await AsyncStorage.getItem('userToken');
            console.log('SignInScreen: ' + userToken);
            this.props.navigation.navigate('App');
        } catch (e) {
            // saving error
        }
    }
}

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome to the app!',
    };

    render() {
        return (
            <View style={styles.container}>
                <Button title="Show me more of the app" onPress={this._showMoreApp}/>
                <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
            </View>
        );
    }

    _showMoreApp = () => {
        this.props.navigation.navigate('Other');
    };

    _signOutAsync = async () => {
        const userToken = await AsyncStorage.getItem('userToken');
        console.log('SignOut: ' + userToken);
        await AsyncStorage.removeItem('userToken');
        const userToken2 = await AsyncStorage.getItem('userToken');
        console.log('userToken: ' + userToken2);
        //await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };
}

class OtherScreen extends React.Component {
    static navigationOptions = {
        title: 'Lots of features here',
    };

    render() {
        return (
            <View style={styles.container}>
                <Button title="I'm done, sign me out" onPress={this._signOutAsync} />
                <StatusBar barStyle="default" />
            </View>
        );
    }

    _signOutAsync = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            console.log('OtherScreen SignOut: ' + userToken);
            await AsyncStorage.removeItem('userToken');
            const userToken2 = await AsyncStorage.getItem('userToken');
            console.log('userToken: ' + userToken2);
            this.props.navigation.navigate('Auth');
        } catch(e) {
            // remove error
        }


    }
}

class AuthLoadingScreen extends React.Component {
    constructor() {
        super();
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            console.log('userToken: ' + userToken);
            this.props.navigation.navigate(userToken ? 'App' : 'Auth');
        } catch(e) {
            console.log('error');
        }
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const AppStack = createStackNavigator({ Home: HomeScreen, Other: OtherScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));
