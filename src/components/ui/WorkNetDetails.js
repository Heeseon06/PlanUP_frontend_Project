import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import DetailRow from './DetailRow';
import moment from 'moment';
import Worknet_logo from '../../assets/images/worknet_logo.png';
import Arrow from '../../assets/images/arrow_black.svg';

const WorkNetDetails = ({ jobDetails }) => {
    const handlePress = () => {
        const { URL } = jobDetails;
        if (URL) {
            Linking.openURL(URL)
                .catch(err => console.error("URL을 열 수 없습니다:", err));
        } else {
            console.error("URL이 정의되지 않았습니다.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <Image style={styles.worknet_logo} source={Worknet_logo} />
                    <Text style={styles.siteName}>워크넷</Text>
                </View>
                <Text style={styles.title}>{jobDetails.직무}</Text>
                <Image style={styles.logo} source={{ uri: jobDetails.회사로고 }} />
                <DetailRow label="마감일" value={jobDetails.마감일} />
                <DetailRow label="경력" value={jobDetails.경력} />
                <DetailRow label="학력" value={jobDetails.학력} />
                <DetailRow label="지역" value={jobDetails.지역} />
                <DetailRow label="고용형태" value={jobDetails.고용형태} />
                <View style={styles.footer}>
                        <Text style={styles.footerText}>{jobDetails.접수기간 || '수시채용'}</Text>
                </View>

                <View style={styles.moveToSite}>
                    <TouchableOpacity onPress={handlePress}>
                        <Image style={styles.moveToSite_logo} source={Worknet_logo} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePress}>
                        <Text style={styles.moveToSite_text}>사이트로 이동</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePress}>
                        <Arrow width={14} height={14} style={styles.arrow} />
                    </TouchableOpacity>
                </View> 
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
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
        borderRadius: 26,
        padding: 16,
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
    header: {
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    siteName: {
        fontSize: 10,
        fontFamily: 'NanumSquareEB',
        color: '#676767',
        marginTop: 0,
    },
    worknet_logo: {
        width: 80,
        height: 30,
        resizeMode: 'contain',
        marginRight: 6,
    },
    title: {
        fontSize: 24,
        color: 'black',
        fontFamily: 'NanumSquareEB',
        marginBottom: 8,
        marginTop: -4,
    },
    logo: {
        width: 240,
        height: 140,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 10,
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
        marginTop: 10,
    },
    moveToSite_logo: {
        width: 80,
        height: 30,
        resizeMode: 'contain',
        marginRight: 8,
        marginTop: -6
    },
    moveToSite_text: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'NanumSquareEB',
        marginBottom: 0,
    },
    arrow: {
        marginTop: 0,
        marginLeft: 4,
    },
});

export default WorkNetDetails;
