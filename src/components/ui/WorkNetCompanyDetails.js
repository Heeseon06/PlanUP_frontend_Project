import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity, Image } from 'react-native';
import DetailRow from './DetailRow';
import Arrow from '../../assets/images/arrow_black.svg';

const WorkNetCompanyDetails = ({ jobDetails }) => {
    const handlePress = () => {
        Linking.openURL(jobDetails.홈페이지);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>기업정보</Text>
                <Image style={styles.logo} source={{ uri: jobDetails.회사로고 }} />
                <DetailRow label="기업명" value={jobDetails.추가_회사명} />
                <DetailRow label="업종" value={jobDetails.업종} />
                <DetailRow label="기업규모" value={jobDetails.기업규모} />
                <DetailRow label="설립년도" value={jobDetails.설립년도} />
                <DetailRow label="연매출액" value={jobDetails.연매출액} />
                <DetailRow label="근로자수" value={jobDetails.근로자수} />
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

export default WorkNetCompanyDetails;
