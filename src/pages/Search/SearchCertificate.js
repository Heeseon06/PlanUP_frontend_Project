// SearchCertificate.js
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import License from '../../assets/images/license_icon.svg';
import HRDK_logo from '../../assets/images/HRDK_logo.png';
import Zoom from '../../assets/images/zoom_icon.svg';
import { API_URL } from '@env';
import Home_icon  from '../../assets/images/home_icon.svg';

const SearchCertificate = () => {
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
        { job_name: trimmedJobName },
        // { job_name: jobName },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Certificates fetched successfully:', response.data);
      if (response.data.length === 0) {
        navigation.navigate('CertificateNo');
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
        <License width={40} style={styles.headerIcon}/>
        <Text style={styles.headerText}>자격증시험추가</Text>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder=" 자격증의 이름을 입력하세요."
            placeholderTextColor={'#47BDFF'}
            value={jobName}
            onChangeText={setJobName}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.zoom} onPress={handleSearch}>
            <Zoom width={24} height={24} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>검색하기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <License width={100} height={100} style={styles.infoIcon}/>
        <Text style={styles.infoTitle}>자격증시험 일정 추가</Text>
        <Text style={styles.infoText}>원하시는 자격증 이름을 검색하면,</Text>
        <Text style={styles.infoText}>올해 예정된 시험 일정을 추가할 수 있어요!</Text> 
        <Image source={HRDK_logo} style={styles.hrdkLogo} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 16
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
  style1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    marginBottom: 10,
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
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoIcon: {
    marginTop : 16,
    marginBottom : 0

  },
  infoTitle: {
    fontSize: 30,
    fontFamily : 'NanumSquareEB',
    color: 'black',
    marginBottom: 6,

  },
  infoText: {
    fontSize: 16,
    fontFamily : 'NanumSquareR',
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
});

export default SearchCertificate;

