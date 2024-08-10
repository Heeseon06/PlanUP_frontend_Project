import React from 'react';
import { View, StyleSheet } from 'react-native';

const HorizontalLine = () => {
    return (
    <View style={styles.line}></View>
    );
};

const styles = StyleSheet.create({
    line: {
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        marginVertical: 3, // 수평선 위아래 여백 조정 (원하는 만큼)
        width: '60%',
        marginLeft: '20%',
        height: 1
    },
});

export default HorizontalLine;