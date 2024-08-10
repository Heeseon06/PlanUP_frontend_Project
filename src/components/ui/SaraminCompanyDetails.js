import React from 'react';
import { View, Text, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import DetailRow from './DetailRow';
import Arrow from '../../assets/images/arrow_black.svg';

const SaraminCompanyDetails = ({ jobDetails }) => {
    const handlePress = () => {
        Linking.openURL(jobDetails.홈페이지);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>기업정보</Text>
                <Image style={styles.logo} source={{ uri: jobDetails.로고이미지 }} />
                <Text style={styles.title}>{jobDetails.추가_회사명}</Text>
                <Text style={styles.build_date}>{jobDetails.설립일}</Text>
                <DetailRow label="대표자명" value={jobDetails.대표자명} />
                <DetailRow label="기업형태" value={jobDetails.기업형태} />
                <DetailRow label="업종" value={jobDetails.업종} />
                <DetailRow label="사원수" value={jobDetails.사원수} />
                <DetailRow label="매출액" value={jobDetails.매출액} />
                <DetailRow label="기업주소" value={jobDetails.기업주소} />
                {/* <DetailRow label="홈페이지" value={jobDetails.홈페이지} /> */}
                <View style={styles.moveToSite}>
                    <TouchableOpacity onPress={handlePress}>
                        <Text style={styles.moveToSite_text}>기업 홈페이지로 이동</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePress}>
                        <Arrow width={14} height={14} style={styles.arrow} />
                    </TouchableOpacity>
                </View>    
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
        borderRadius: 30,
        padding: 16,
        marginBottom: 0,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 8,
        // elevation: 3,
        borderWidth: 2,
        borderColor: '#4876EF',
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'NanumSquareEB',
        color: '#B3B3B3',
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontFamily: 'NanumSquareEB',
        color: 'black',
        marginBottom: 2,
    },
    build_date: {
        fontSize: 12,
        fontFamily: 'NanumSquareB',
        color: '#B3B3B3',
        marginBottom: 16,
    },
    logo: {
        width: 300,
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 0,
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
    },
});

export default SaraminCompanyDetails;
