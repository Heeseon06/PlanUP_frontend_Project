import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator, TouchableOpacity, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

function AppNavigator() {
    const { isLoggedIn, isLoading, setIsLoggedIn, setUser } = useAuth();
    const handleLogout = (navigation, setIsLoggedIn, setUser) => {
        Alert.alert('Logout', 'Do you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: () =>  {
                AsyncStorage.removeItem('token')
                    .then(() => {
                        setIsLoggedIn(false);
                        setUser(null);
                        console.log('로그아웃 성공');
                        Alert.alert('로그아웃 성공', '로그아웃에 성공했습니다.');
                        navigation.navigate('LoginPage');
                    })
                    .catch((error) => {
                        console.error('로그아웃 오류:', error);
                        Alert.alert('로그아웃 오류', '로그아웃 중 오류가 발생했습니다.', error);
                    });
            }}
        ]);
    };
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    return (
        <Stack.Navigator
        screenOptions={({ navigation }) => ({
            headerRight: () => (
            <TouchableOpacity 
            onPress={() => handleLogout(navigation, setIsLoggedIn, setUser)}
            style={{ marginRight: 10 }}>
                <Text style={{ color: '#007AFF', fontSize: 16 }}>Logout</Text>
            </TouchableOpacity>
            ),
        })}>
            {isLoggedIn ? (
                <Stack.Screen name="Main" component={MainNavigator} options={{ headerShown: false }}/>
            ) : (
                <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }}/>
            )}
        </Stack.Navigator>
    );
}

export default AppNavigator;