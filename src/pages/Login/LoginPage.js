import React, {useLayoutEffect} from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginInputBox from '../../components/ui/LoginInputBox';
import { API_URL } from '@env';
import Logo from '../../assets/images/logo.svg';

function LoginPage({ navigation }) {
    const { setIsLoggedIn } = useAuth();
    const { setUser } = useAuth();

    const [userid, setUserid] = React.useState('');
    const [password, setPassword] = React.useState('');

    const goToSignup = () => {
        console.log('Go to SignupPage button pressed');
        navigation.navigate('SignupPage');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const onLogin = async () => {
        try {
            const response = await fetch(`${API_URL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid: userid,
                    password: password,
                }),
            });

            const data = await response.json();

            if (data.token) {
                await AsyncStorage.setItem('token', data.token);
                setIsLoggedIn(true);
                setUser(data.user);
                console.log('로그인 성공:', data);
                Alert.alert('로그인 성공', '로그인 되었습니다.');
                navigation.navigate('MainPage', {
                    params: data.user,
                });
            } else {
                console.log('로그인 실패:', data.message);
                Alert.alert('로그인 실패', '아이디 또는 비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            console.error('오류 발생:', error);
            Alert.alert('오류 발생', '로그인 중 오류가 발생했습니다.', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* <Image 
                        source={require('../../assets/images/logo_ani.gif')}  
                        style={{width: 80, height: 100, resizeMode: 'contain', marginBottom: 0, marginTop: -120, alignSelf: 'center'}}
            /> */}
            <Logo style={styles.logo} width={82} height={100} />
            <Text style={styles.app_name}>PLAN UP</Text>
            <Text style={styles.title}>로그인</Text>
            <LoginInputBox
                title="아이디"
                text="아이디를 입력하세요"
                value={userid}
                onChangeText={setUserid}
            />
            <LoginInputBox
                title="비밀번호"
                text="비밀번호를 입력하세요"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={styles.buttonBox}>
                <TouchableOpacity 
                style={[
                    styles.button, 
                    { 
                        backgroundColor: 'white',
                        borderColor: '#06A4FD',
                        borderWidth: 2,
                    }]} 
                onPress={onLogin}
                >
                    <Text style={[styles.buttonText, {color: '#06A4FD',}]}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={[
                    styles.button, 
                    { backgroundColor: '#06A4FD' }
                ]} 
                onPress={goToSignup}
                >
                    <Text style={styles.buttonText}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        alignSelf: 'center',
        marginBottom: 4,
    },
    button: {
        paddingVertical: 6,
        paddingHorizontal: 30,
        borderRadius: 15,
        marginBottom: 5,
        width: 130,
        height: 40,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    buttonBox:{
        width: 300,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    app_name: {
        fontFamily: 'NanumSquareEB',
        fontSize: 20,
        color: 'black',
        marginBottom: 16,
        marginTop: -26,
    },
    title: {
        fontSize: 30,
        fontFamily: 'NanumSquareEB',
        marginBottom: 20,
        color: '#06A4FD'
    },
    innerText:{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#25A4FF',
        marginBottom: 5,
        marginLeft: 5,
    },
});

export default LoginPage;