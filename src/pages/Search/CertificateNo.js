// CertificateNo.js
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import License from '../../assets/images/license_icon.svg';
import HRDK_logo from '../../assets/images/HRDK_logo.png';
import Zoom from '../../assets/images/zoom_icon.svg';
import No_result from '../../assets/images/delete_icon.svg';
import Back from '../../assets/images/back_icon.svg';
import { API_URL } from '@env';
import Home_icon  from '../../assets/images/home_icon.svg';

const CertificateNo = () => {
  const [jobName, setJobName] = useState('');
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  const handleGoToMainPage = () => {
    navigation.navigate('MainPage');
  };

  const handleSearch = async () => {
    try {
      const trimmedJobName = jobName.trim(); // 수정된 부분: 양쪽 끝의 공백 제거
      console.log(`Searching for job name: ${trimmedJobName}`);
      // console.log(`Searching for job name: ${jobName}`);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${API_URL}/certifi/job_name`, 
        { job_name: trimmedJobName }, // 수정된 부분: 트림된 jobName 사용
        // { job_name: jobName },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Certificates fetched successfully:', response.data);
      if (response.data.length === 0) {
        Alert.alert(
          "검색 결과 없음",
          "이름이 잘못되었거나, 시험 예정 일정이 없어요.민간자격증의 경우, 검색되지 않아요.",
          [{ text: "확인" }]
        );
      } else {
        navigation.navigate('CertificateResult', { certificates: response.data });
      }
    } catch (error) {
      console.error('Failed to fetch certificates', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <License width={40} style={styles.headerIcon} />
        <Text style={styles.headerText}>자격증시험추가</Text>
      </View>
      <View style={styles.searchContainer}>
      <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="자격증의 이름을 입력하세요."
            value={jobName}
            onChangeText={setJobName}
            onSubmitEditing={handleSearch} // 수정된 부분: Enter 키를 누르면 handleSearch 호출
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>검색하기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.resultContainer}>
        <No_result style={styles.No_result_icon} />
        <Text style={styles.infoTitle}>검색결과가 없어요.</Text>
        <Text style={styles.infoText}>이름이 잘못되었거나, 시험 예정 일정이 없어요.</Text>
        <Text style={styles.infoText}>민간자격증의 경우, 검색되지 않아요.</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>※ 현재 국가공인 자격증만 검색할 수 있어요.</Text>
        <Text style={styles.footerText}>검색에 되지 않는 자격증은 자격 일정으로 추가해주세요.</Text>
        <Text style={styles.footerText2}>※ 시험이 종료된 시험 일정은 검색되지 않아요.</Text>
      </View>
      <View style={styles.style1}>
          <TouchableOpacity
            onPress={handleGoToMainPage}>
            <Home_icon width={30} height={30} />
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backbutton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
      fontSize: 14,
      fontFamily: 'NanumSquareEB',
      color: '#06A4FD',
      marginRight: 4,
  },
  backIcon: {
      marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16,
    marginTop: -14
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    marginTop: 0
  },
  headerText: {
    fontSize: 18,
    fontFamily : 'NanumSquareEB',
    color : 'black',
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '92%',
    borderWidth: 1.5,
    borderColor: '#47BDFF',
    borderRadius: 25,
    paddingLeft: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  zoom: {
    position: 'absolute',
    right: 16,
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: 'NanumSquareBR',
    paddingLeft: 10, 
  },
  button: {
    backgroundColor: '#06A4FD',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  No_result_icon: {
    marginTop : 16,
    marginBottom : 24
  },
  infoTitle: {
    fontSize: 30,
    fontFamily : 'NanumSquareEB',
    color: 'black',
    marginBottom: 6,

  },
  infoText: {
    fontSize: 16,
    fontFamily : 'NanumSquareB',
    textAlign: 'center',
    color: 'black',
  },
  hrdkLogo: {
    width: 120,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 6,
    marginTop: 20
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily : 'NanumSquareB',
    color: '#06A4FD',
    textAlign: 'center',
    marginTop : 1
  },
  footerText2: {
    fontSize: 14,
    fontFamily : 'NanumSquareB',
    color: '#06A4FD',
    textAlign: 'center',
    marginTop : 10
  },
  style1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 120,
    marginBottom: 10,
  },
});

export default CertificateNo;
