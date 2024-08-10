import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Image } from 'react-native';
import DetailRow from './DetailRow';
import Arrow from '../../assets/images/arrow_black.svg';

const WorkNetMobileCompanyDetails = ({ jobDetails }) => {
    // const handlePress = () => {
    //     const { 홈페이지 } = jobDetails;
    //     if (홈페이지) {
    //         Linking.openURL(홈페이지)
    //             .catch(err => console.error("URL을 열 수 없습니다:", err));
    //     } else {
    //         console.error("URL이 정의되지 않았습니다.");
    //     }
    // };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>기업정보</Text>
                <Image style={styles.logo} source={{ uri: jobDetails.회사로고 || 'default_logo_uri' }} />
                <DetailRow label="기업명" value={jobDetails.회사명 || '회사명 없음'} />
                <DetailRow label="업종" value={jobDetails.업종 || '업종 정보 없음'} />
                <DetailRow label="기업규모" value={jobDetails.기업규모 || '기업규모 정보 없음'} />
                <DetailRow label="설립년도" value={jobDetails.설립일 || '설립일 정보 없음'} />
                <DetailRow label="연매출액" value={jobDetails.매출액 || '매출액 정보 없음'} />
                <DetailRow label="근로자수" value={jobDetails.근로자 || '근로자 정보 없음'} />

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container : {
        flex: 1,
        padding: 10,
        borderRadius: 30,
        backgroundColor : 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 0,
        borderTopWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderBottomWidth: 3,
        borderTopColor: '#39B54A', 
        borderLeftColor : '#39B54A',
        borderRightColor: '#216AB3', 
        borderBottomColor: '#216AB3', 
        borderRadius: 30,
    },
    logo: {
        width: 300,
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'NanumSquareEB',
        color: '#B3B3B3',
        marginBottom: 12,
    },
    moveToSite: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop : 14,
        marginBottom: 10,
    },
    moveToSite_text: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'NanumSquareEB',
        marginBottom: -6,
    },
    arrow: {
        marginTop: 4,
        marginLeft: 4,
    }
});

export default WorkNetMobileCompanyDetails;
