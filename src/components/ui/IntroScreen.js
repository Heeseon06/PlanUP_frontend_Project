import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Logo from '../../assets/images/logo.svg';

function IntroScreen({ navigation }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('MainPage');  
        }, 1800); // 시간 설정

        return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* <Image 
                source={require('../../assets/images/logo_ani.gif')}  
                style={{width: 100, height: 100, resizeMode: 'contain', marginBottom: 0, marginTop: 0, alignSelf: 'center'}}
                /> */}
            <Logo style={styles.logo} width={100} height={100} />   
            <Text style={styles.App_name}>PLAN UP</Text>
           
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    App_name: {
        fontSize: 24,
        fontFamily: 'NanumSquareEB',
        color: 'black',
        marginTop: -16,
        marginBottom: 10,
    },
    logo: {
        marginBottom: 0,
        alignSelf: 'center',
    },
    
});

export default IntroScreen;
