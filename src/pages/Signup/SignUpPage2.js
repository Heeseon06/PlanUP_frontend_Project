import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, Button , SafeAreaView, ScrollView, Image} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import LoginInputBox from '../../components/ui/LoginInputBox';
import {validateEmail, validateHP, validateName} from '../../utils/validateRegex';
import { API_URL } from '@env';


function SignupPage2() {
    const route = useRoute();
    const { userid, password } = route.params;

    const [email, setEmail] = React.useState('');
    const [name, setName] = React.useState('');
    const [hp, setHp] = React.useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidName, setIsValidName] = useState(false);
    const [isValidHP, setIsValidHP] = useState(false);
    const [validNameText, setValidNameText] = useState('');
    const [validNameColor, setValidNameColor] = useState({ color: '#06A4FD' });
    const [validEmailText, setValidEmailText] = useState('');
    const [validEmailColor, setValidEmailColor] = useState({ color: '#06A4FD' });
    const [validHPText, setValidHPText] = useState('');
    const [validHPColor, setValidHPColor] = useState({ color: '#06A4FD' });

    const handleValidateName = (name) => {
        if (name === '') {
            setIsValidName(false);
            return;
        }else{
            const isValid = validateName(name);
            if (!isValid) {
                setIsValidName(false);
                setValidNameText('이름을 다시 확인해주세요.');
                setValidNameColor({ color: 'red' });
            } else {
                setValidNameColor({ color: '#06A4FD' });
                setValidNameText('');
                setIsValidName(true);
            }
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const handleValidateEmail = (email) => {
        if (email === '') {
            setIsValidEmail(false);
            return;
        }else{
            const isValid = validateEmail(email);
            if (!isValid) {
                setIsValidEmail(false);
                setValidEmailText('이메일 형식을 다시 확인해주세요.');
                setValidEmailColor({ color: 'red' });
            } else {
                setValidEmailColor({ color: '#06A4FD' });
                setValidEmailText('');
                setIsValidEmail(true);
            }
        }
    };
    const handleValidateHP = (hp) => {
        if (hp === '') {
            setIsValidHP(false);
            return;
        }else{
            const isValid = validateHP(hp);
            if (!isValid) {
                setIsValidHP(false);
                setValidHPText('전화번호 형식을 다시 확인해주세요.');
                setValidHPColor({ color: 'red' });
            } else {
                setValidHPText('')
                setValidHPColor({ color: '#06A4FD' });
                setIsValidHP(true);
            }
        }
    };

    const navigation = useNavigation();

    const goToSignup = () => {
        if (!isValidName || !isValidEmail || !isValidHP) {
            Alert.alert('오류', '모든 입력란을 올바르게 작성해주세요.');
            return;
        }
        fetch(`${API_URL}/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                userid,
                password,
                hp,
                email,
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Signup 성공:', data);
            Alert.alert('회원가입', '회원가입이 완료되었습니다!');
            navigation.navigate('LoginPage');
        })
        .catch((error) => {
            console.error('Signup 오류:', error);
            Alert.alert('회원가입 오류', '회원가입 중 오류가 발생했습니다.', error);
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Image 
                    source={require('../../assets/images/logo_ani.gif')}  
                    style={{width: 100, height: 100, resizeMode: 'contain', marginBottom: 0, marginTop: -80, alignSelf: 'center'}}
                    />
                    <View style={styles.textBox}>
                        <Text style={styles.subText}>추가 정보를 입력해주세요.</Text>
                    </View>
                    <View>
                        <LoginInputBox
                            title="이름"
                            text="이름을 입력하세요"
                            value={name}
                            onChangeText={(e) => {
                                setName(e);
                                handleValidateName(e);
                            }}
                            borderColor={validNameColor.color}
                        />
                        <Text style={[styles.validateText, validNameColor]}>{validNameText}</Text>
                    </View>
                    <View>
                        <LoginInputBox
                            title="연락처"
                            text="전화번호를 입력하세요 ( - 포함하여 입력 )"
                            value={hp}
                            onChangeText={(e) => {
                                setHp(e);
                                handleValidateHP(e);
                            }}
                            keyboardType="numeric"
                            borderColor={validHPColor.color}
                        />
                        <Text style={[styles.validateText, validHPColor]}>{validHPText}</Text>
                    </View>
                    <View>
                        <LoginInputBox
                            title="이메일"
                            text="이메일을 입력하세요"
                            value={email}
                            onChangeText={(e) => {
                                setEmail(e);
                                handleValidateEmail(e);
                            }}
                            keyboardType="email-address"
                            borderColor={validEmailColor.color}
                        />
                        <Text style={[styles.validateText, validEmailColor]}>{validEmailText}</Text>
                    </View>
                    
                    <TouchableOpacity 
                    style={[styles.button , (!isValidName || !isValidEmail || !isValidHP) && styles.buttonDisabled]} 
                    onPress={goToSignup}
                    disabled={!isValidName || !isValidEmail || !isValidHP}
                    >
                        <Text style={styles.buttonText}>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    validateText: {
        position: 'absolute',
        right: 10,
        top: 5,
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: 'gray',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 5,
        width: 100,
        height: 35,
    },
    postcode: {
        width: '100%',
        height: '90%',
    },

    smallButton: {
        backgroundColor: '#06A4FD',
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginBottom: 5,
        width: 70,
        height: 20,
        position: 'absolute',
        right: 10,
        top: 5,
    },
    smallButtonText: {
        color: 'white',
        fontSize: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#06A4FD',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 5,
        width: 100,
        height: 35,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'NanumSquareB',
        marginTop: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#25A4FF'
    },
    subText: {
        fontSize: 22,
        color: 'black',
        fontFamily: 'NanumSquareEB',
        marginLeft: 6,
        textAlign: 'left'
    },
    textBox: {
        marginLeft: 65,
        marginBottom: 20,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 20,
    },
    labelBox: {
        marginLeft: 65,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 20,
    },
    label: {
        color: '#25A4FF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft: 5,
        textAlign: 'left',
    },
    separator: {
        paddingHorizontal: 8,
        fontSize: 18,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 300,
    },
    textInput: {
        width: 130,
        height: 45,
        borderColor: '#25A4FF',
        borderWidth: 2,
        borderRadius: 13,
        marginBottom: 10,
        paddingLeft: 10,
        textAlign: 'left',
    },
});

export default SignupPage2;
