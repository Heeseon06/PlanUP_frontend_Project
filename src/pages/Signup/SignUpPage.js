import React, {useLayoutEffect} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import LoginInputBox from '../../components/ui/LoginInputBox';
import { validateId, validatePassword } from '../../utils/validateRegex';
import { API_URL } from '@env';
import Logo from '../../assets/images/logo.svg';

function SignupPage() {
    const [userid, setUserid] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordVerify, setPasswordVerify] = React.useState('');
    const [isValidId, setIsValidId] = React.useState(false);
    const [isValidPassword, setIsValidPassword] = React.useState(false);
    const [isValidPasswordVerify, setIsValidPasswordVerify] = React.useState(false);
    const [idValidText, setIdValidText] = React.useState('');
    const [idValidColor, setIdValidColor] = React.useState({ color: '#06A4FD' });
    const [passwordValidText, setPasswordValidText] = React.useState('');
    const [passwordValidColor, setPasswordValidColor] = React.useState({ color: '#06A4FD' });
    const [passwordVerifyValidText, setPasswordVerifyValidText] = React.useState('');
    const [passwordVerifyValidColor, setPasswordVerifyValidColor] = React.useState({ color: '#06A4FD' });


    const navigation = useNavigation();

    const handleValidateId = (id) => {
        if (id === '') {
            setIsValidId(false);
            return;
        }else{
            const isValid = validateId(id);
            if (!isValid) {
                setIsValidId(false);
                setIdValidText('아이디는 4자 이상, 영문자, 숫자만 허용됩니다.');
                setIdValidColor({ color: 'red' });
            } else {
                setIdValidText('사용가능한 아이디 입니다.');
                setIdValidColor({ color: '#06A4FD' });
                setIsValidId(true);
            }
        }
    };

    const handleValidatePassword = (pass) => {
        if (pass === '') {
            setIsValidPassword(false)
            return;
        }
        const isValid = validatePassword(pass);
        if (!isValid) {
            setIsValidPassword(false)
            setPasswordValidText("8자 이상, 대문자, 특수문자를 포함해야 합니다.");
            setPasswordValidColor({ color: 'red' })
        } else {
            setPasswordValidText("사용가능한 비밀번호 입니다.")
            setPasswordValidColor({ color: '#06A4FD' })
            setIsValidPassword(true);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const handleValidatePasswordVerify = (pass) => {
        if (pass === '') {
            setIsValidPasswordVerify(false)
            return;
        }
        if (password !== pass) {
            setIsValidPasswordVerify(false)
            setPasswordVerifyValidText("비밀번호가 일치하지 않습니다.");
            setPasswordVerifyValidColor({ color: 'red' })
        } else if (password === pass){
            setPasswordVerifyValidText("사용가능한 비밀번호 입니다.")
            setPasswordVerifyValidColor({ color: '#06A4FD' })
            setIsValidPasswordVerify(true);
        }
    }

    const goToNextPage = async () => {
        if (!isValidId || !isValidPassword || !isValidPasswordVerify) {
            Alert.alert('오류', '모든 입력란을 올바르게 작성해주세요.');
            return;
        }
        try {
            const response = await fetch(`${API_URL}/user/get_user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userid,
                }),
            });
    
            if (response.status === 200) {
                const req = await response.json();
                setIsValidId(false)
                setIdValidText("이미 사용중인 아이디입니다.");
                setIdValidColor({ color: 'red' })
                Alert.alert('아이디 중복', '이미 사용중인 아이디입니다.');
                return;
            } else if (response.status === 401) {
                navigation.navigate('SignupPage2', {
                    userid,
                    password,
                });
            } else {
                Alert.alert('서버 오류', '서버와 통신 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('서버 오류', '서버와 통신 중 오류가 발생했습니다.');
        }
    };

    return (
        <View style={styles.container}>
            {/* <Image 
                source={require('../../assets/images/logo_ani.gif')}  
                style={{width: 100, height: 100, resizeMode: 'contain', marginBottom: 0, marginTop: -60, alignSelf: 'center'}}
                /> */}
            <Logo style={styles.logo} width={82} height={100} />    
            <View style={styles.TextBox}>
                <Text style={styles.title}>환영합니다!</Text>
                <Text style={styles.smallText}>원하시는 꿈을 이루실 수 있도록 최선을</Text>
                <Text style={styles.smallText}>다 할게요.</Text>
            </View>
            <View style={styles.TextBox}>
                <Text style={styles.subText}>사용하실 아이디와</Text>
                <Text style={styles.subText}>비밀번호를 입력해주세요.</Text>
            </View>
            <View style={styles.margin}>
            <LoginInputBox
                title="아이디"
                text="가입하실 아이디를 입력하세요"
                value={userid}
                onChangeText={(e) => {
                    setUserid(e)
                    handleValidateId(e);
                }}
                borderColor={idValidColor.color}
                />
            <Text style={[styles.validateText, idValidColor]}>{idValidText}</Text>
            </View>
            <View style={styles.margin}>
            <LoginInputBox
                title="비밀번호"
                text="비밀번호를 입력하세요"
                value={password}
                onChangeText={(e) => {
                    setPassword(e)
                    handleValidatePassword(e);
                }}
                secureTextEntry
                borderColor={passwordValidColor.color}
            />
            <Text style={[styles.validateText, passwordValidColor]}>{passwordValidText}</Text>
            </View>
            <View style={styles.margin}>
            <LoginInputBox
                title="비밀번호 확인"
                text="비밀번호를 다시 한 번 입력해주세요"
                value={passwordVerify}
                onChangeText={(e) => {
                    setPasswordVerify(e)
                    handleValidatePasswordVerify(e);
                }}
                secureTextEntry
                borderColor={passwordVerifyValidColor.color}
            />
            <Text style={[styles.validateText, passwordVerifyValidColor]}>{passwordVerifyValidText}</Text>
            </View>
            <TouchableOpacity 
            style={[styles.button, (!isValidId || !isValidPassword || !isValidPasswordVerify) && styles.buttonDisabled]} 
            onPress={goToNextPage}
            disabled={!isValidId || !isValidPassword || !isValidPasswordVerify}
            >
                <Text style={styles.buttonText}>다음</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    validateText: {
        marginBottom: 5,
    },
    buttonDisabled: {
        backgroundColor: 'gray',
        paddingVertical: 5,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginBottom: 5,
        width: 100,
        height: 35,
        marginTop: 30,
    },
    button: {
        backgroundColor: '#06A4FD',
        paddingVertical: 5,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginBottom: 5,
        width: 100,
        height: 35,
        marginTop: 30,
    },
    buttonText: {
        color: 'white',
        fontFamily: 'NanumSquareB',
        marginTop: 4,
        marginBottom: 0,
        fontSize: 16,
        textAlign: 'center',
    },
    title: {
        fontSize: 28,
        fontFamily: 'NanumSquareEB',
        color: 'black'
    },
    smallText: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'NanumSquareB',
        textAlign: 'left'
    },
    margin: {
        marginBottom: 0,
    },
    subText: {
        fontSize: 17,
        color: 'black',
        fontFamily: 'NanumSquareEB',
        textAlign: 'left'
    },
    TextBox: {
        marginBottom: 20,
        marginLeft: 100,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        width: '100%',
    },
});

export default SignupPage;