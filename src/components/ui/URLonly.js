// export default URLOnly;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/images/logo.svg'
import License from '../../assets/images/license_icon.svg';
import Jobsite from '../../assets/images/jobsite_logo5.png';
import HRDK_logo from '../../assets/images/HRDK_logo.png';

const URLOnly = () => {
    const navigation = useNavigation();
    
    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('SearchMain')}>
            <View style={styles.card}>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('URLInputPage')}>
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                    <View style={styles.item1}>
                        <Logo width={26} height={30} style={styles.logo}/>
                        <Text style={styles.addposting}>취업공고 추가</Text>
                    </View>
                    <Text style={styles.title}>취업공고 URL을 입력해주세요!</Text>
                    <Text style={styles.description}>취업 공고 일정을 캘린더에 추가할 수 있어요.</Text>
                    <Image source={Jobsite} style={styles.job5} />
                </View>
                <View style={styles.separator} />
                <View style={styles.section}>
                    <View style={styles.item2}>
                        <License width={74} height={50} style={styles.license} />
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SearchCertificate')}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.addposting2}>자격증 시험 추가</Text>
                    <Text style={styles.title}>시험일정을 검색해보세요!</Text>
                    <Text style={styles.description}>자격증 시험 일정을 캘린더에 등록할 수 있어요.</Text>
                    <Text style={styles.note}>※ 검색이 되지 않는 자격증은 자주 일정으로 추가해주세요.</Text>
                    <Image source={HRDK_logo} style={styles.hrLogo} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        // padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 30,
    },
    section: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 30,
    },
    button: {
        backgroundColor: '#06A4FD',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 3,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
    },
    addposting: {
        color: '#06A4FD',
        fontSize: 17,
        fontFamily: 'NanumSquareEB',
    },
    addposting2: {
        color: '#06A4FD',
        fontSize: 17,
        fontFamily: 'NanumSquareEB',
        marginBottom: 10,
    },
    logo: {
        marginRight: 5,
    },
    title: {
        fontSize: 20,
        fontFamily: 'NanumSquareEB',
        color: 'black',
        marginBottom: 3,
    },
    description: {
        fontSize: 14,
        color: 'black',
        fontFamily: 'NanumSquareR',
        textAlign: 'center',
        marginTop: 1,
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        width: '100%',
        marginVertical: 20,
    },
    note: {
        fontSize: 12,
        color: '#06A4FD',
        textAlign: 'center',
        fontFamily: 'NanumSquareB',
        marginBottom: 10,
        marginTop: 8,
    },
    hrLogo: {
        width: 120,
        height: 80,
        resizeMode: 'contain',
        marginBottom: 10,
    },

    item1: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    item2: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    license: {
        marginRight: 14,
        marginBottom: 8,
    },
    job5: {
        width: 240,
        height: 60,
        resizeMode: 'contain',
        marginTop: 10,
    },
});

export default URLOnly;

