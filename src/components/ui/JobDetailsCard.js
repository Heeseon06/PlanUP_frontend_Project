import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const JobDetailsCard = () => {
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('${API_URL}/scrape', {
                    url: '크롤링할 URL을 여기에 넣으세요'
                });
                setJobDetails(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!jobDetails) {
        return <Text>No job details available.</Text>;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>취업공고를 불러왔어요!</Text>
                <TouchableOpacity style={styles.calendarButton}>
                    <Text style={styles.calendarButtonText}>해당 공고를 캘린더에 추가하기</Text>
                </TouchableOpacity>
                <View style={styles.detailsContainer}>
                    <Text style={styles.company}>{jobDetails.회사명}</Text>
                    <Text style={styles.position}>{jobDetails.직무}</Text>
                    <Text style={styles.info}>경력: {jobDetails.경력}</Text>
                    <Text style={styles.info}>학력: {jobDetails.학력}</Text>
                    <Text style={styles.info}>근무형태: {jobDetails.근무형태}</Text>
                    <Text style={styles.info}>근무지역: {jobDetails.근무지역}</Text>
                    <Text style={styles.info}>업종: {jobDetails.업종}</Text>
                    <Text style={styles.info}>마감일: {jobDetails.마감일}</Text>
                </View>
                <TouchableOpacity style={styles.linkButton}>
                    <Text style={styles.linkButtonText}>saramin 사이트로 이동</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.card}>
                <Text style={styles.companyInfoTitle}>기업정보</Text>
                <Text style={styles.info}>대표자명: {jobDetails.대표자명}</Text>
                <Text style={styles.info}>기업형태: {jobDetails.기업형태}</Text>
                <Text style={styles.info}>업종: {jobDetails.업종}</Text>
                <Text style={styles.info}>사원수: {jobDetails.사원수}</Text>
                <Text style={styles.info}>매출액: {jobDetails.매출액}</Text>
                <Text style={styles.info}>주소: {jobDetails.기업주소}</Text>
                <TouchableOpacity style={styles.linkButton}>
                    <Text style={styles.linkButtonText}>기업 홈페이지로 이동</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    calendarButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 4,
        padding: 10,
        marginBottom: 16,
    },
    calendarButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    detailsContainer: {
        marginBottom: 16,
    },
    company: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    position: {
        fontSize: 16,
        marginBottom: 8,
    },
    info: {
        fontSize: 14,
        marginBottom: 4,
    },
    linkButton: {
        backgroundColor: '#2196F3',
        borderRadius: 4,
        padding: 10,
        marginTop: 16,
    },
    linkButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    companyInfoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default JobDetailsCard;
