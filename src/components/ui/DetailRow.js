import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailRow = ({ label, value }) => {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        flexWrap: 'wrap', // 추가: 텍스트가 길 경우 줄 바꿈
    },
    detailLabel: {
        fontSize: 14,
        fontFamily: 'NanumSquareEB',
        color: '#06A4FD',
        flex: 1, // 추가: 레이아웃 정리
    },
    detailValue: {
        fontSize: 14,
        fontFamily: 'NanumSquareB',
        color: 'black',
        flex: 2, // 추가: 레이아웃 정리
    },
});

export default DetailRow;
