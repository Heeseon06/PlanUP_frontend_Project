import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/images/logo.svg'
import License from '../../assets/images/license_icon.svg';


const AddURL = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <License width={24} height={20} style={styles.license} />
                <Text style={styles.text}>자격증시험추가</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SearchCertificate')}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.item}>
                <Logo width={22} height={20} style={styles.logo} />
                <Text style={styles.text}>취업공고추가</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('URLInputPage')}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        color: '#06A4FD',
        marginRight: 6,
        fontSize: 16,
        fontFamily: 'NanumSquareEB',
    },
    button: {
        backgroundColor: '#06A4FD', 
        borderRadius: 1,
        paddingHorizontal: 9,
        paddingVertical: 1,
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        lineHeight: 24,
    },
    logo: {
        marginRight: 4,
    },
    license: {
        marginRight: 4,
    },
});

export default AddURL;
