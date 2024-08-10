import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from '../pages/Login/LoginPage';
import SignupPage from '../pages/Signup/SignUpPage';
import SignupPage2 from '../pages/Signup/SignUpPage2';

const Stack = createNativeStackNavigator();

function AuthNavigator() {
    return (
        <Stack.Navigator initialRouteName="LoginPage">
            <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: true ,
            }} />
            <Stack.Screen name="SignupPage" component={SignupPage} options={{ headerShown: true }} />
            <Stack.Screen name="SignupPage2" component={SignupPage2} />
        </Stack.Navigator>
    );
}

export default AuthNavigator;