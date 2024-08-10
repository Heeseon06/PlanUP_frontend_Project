import React from 'react';
import { View, Text, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import moment from 'moment';
import DetailRow from './DetailRow'; // DetailRow 컴포넌트 임포트
import Saramin_logo from '../../assets/images/saramin_logo.png';
import Arrow from '../../assets/images/arrow_black.svg';

const SaraminDetails = ({ jobDetails }) => {
    const handlePress = () => {
        const { URL } = jobDetails;
        if (URL) {
            Linking.openURL(URL)
                .catch(err => console.error("URL을 열 수 없습니다:", err));
        } else {
            console.error("URL이 정의되지 않았습니다.");
        }
    };

    // D-day 계산
    const calculateDday = (endDate) => {
        const today = moment();
        const end = moment(endDate, 'YYYY.MM.DD HH:mm');
        return end.diff(today, 'days');
    };

    const dDay = jobDetails.마감일 ? calculateDday(jobDetails.마감일) : null;
    const closingDateText = dDay !== null ? `D-${dDay}` : '수시채용';

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Image style={styles.saramin_logo} source={Saramin_logo} />
                    <Text style={styles.siteName}>사람인</Text>
                </View>
                <View style={styles.headtitle}>   
                    <Text style={styles.title}>[ {jobDetails.회사명} ] {jobDetails.직무}</Text>
                </View>
                <Image style={styles.logo} source={{ uri: jobDetails.로고이미지 }} />
                <View style={styles.details}>
                    <DetailRow label="경력 조건" value={jobDetails.경력} />
                    <DetailRow label="학력" value={jobDetails.학력} />
                    <DetailRow label="근무지역" value={jobDetails.근무지역} />
                    <DetailRow label="근무형태" value={jobDetails.근무형태} />
                </View>
                <Text style={styles.date}>{closingDateText}</Text>
                <Text style={styles.closingDate}>{jobDetails.마감일}</Text>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>접수 시작일: {jobDetails.접수시작일 || '수시채용'}</Text>
                    <Text style={styles.footerText}>접수 마감일: {jobDetails.마감일 || '수시채용'}</Text>
                </View>
                <View style={styles.moveToSite}>
                    <TouchableOpacity onPress={handlePress}>    
                        <Image style={styles.moveToSite_logo} source={Saramin_logo} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePress}>
                        <Text style={styles.moveToSite_text}>사이트로 이동</Text>
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
        marginBottom: 20
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
    header: {
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    saramin_logo: {
        width: 80,
        height: 20,
        resizeMode: 'contain',
        marginRight: 6,
    },
    siteName: {
        fontSize: 10,
        fontFamily: 'NanumSquareEB',
        color: '#676767',
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        color: 'black',
        fontFamily : 'NanumSquareEB',
        marginBottom: 8,
        marginTop: -4,
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 0,
    },
    details: {
        borderTopWidth: 1,
        borderTopColor: '#e1e1e1',
        paddingTop: 16,
        marginTop: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        flexWrap: 'wrap',  // 추가: 텍스트가 길 경우 줄 바꿈
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0077B6',
        flex: 1,  // 추가: 레이아웃 정리
    },
    detailValue: {
        fontSize: 14,
        color: '#555',
        flex: 2,  // 추가: 레이아웃 정리
    },
    date: {
        fontSize: 34,
        fontFamily: 'NanumSquareEB',
        color: 'black',
        textAlign: 'center',
        marginTop: 12,
    },
    closingDate: {
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
        marginTop: -4,
        marginBottom: 20,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#e1e1e1',
        paddingTop: 8,
    },
    footerText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
        fontFamily: 'NanumSquareB',
    },
    moveToSite: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop : 8,
    },
    moveToSite_logo: {
        width: 80,
        height: 30,
        resizeMode: 'contain',
        marginRight: 8,
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

export default SaraminDetails;
