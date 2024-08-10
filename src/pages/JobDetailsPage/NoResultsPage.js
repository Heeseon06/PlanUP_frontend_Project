import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import No_result from '../../assets/images/delete_icon.svg';
import Back from '../../assets/images/back_icon.svg';
import Jobsite from '../../assets/images/jobsite_logo5.png';
import Home_icon  from '../../assets/images/home_icon.svg';

const NoResultsPage = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);
  
  const handleGoToMainPage = () => {
    navigation.navigate('MainPage');
  };

  return (
    <View style={styles.container}>
      <View style={styles.back}>
      <TouchableOpacity style={styles.backbutton} onPress={() => navigation.navigate('URLInputPage')}>
        <Text style={styles.backText}>다시 입력하기</Text>
        <Back width={22} height={22} style={styles.backIcon} />
      </TouchableOpacity>   
      </View>
      <View style={styles.resultContainer}>
        <No_result style={styles.No_result_icon} />
        <Text style={styles.infoTitle}>공고를 불러올 수 없어요.</Text>
        <Text style={styles.infoText}>URL 주소가 잘못되었거나,</Text>
        <Text style={styles.infoText}>지원하는 사이트가 아니에요.</Text>
      </View>
      <View style={styles.middle}>
        <Text style={styles.middleText}>해당 취업공고의 상세 정보가 나와있는 페이지의</Text>
        <Text style={styles.middleText}>URL 주소로 검색해주세요!</Text>
        <Text style={styles.middleText2}>※ 취업공고 검색 후, 해당 공고 페이지에 접속한 URL</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>현재 아래 사이트들의 공고만 지원해드리고 있어요.</Text>
        <Text style={styles.footerText}>해당 사이트의 URL인지 확인해주세요.</Text>
      </View>
      <Image source={Jobsite} style={styles.job5} />

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
  resultContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 0
  },
  back: {
    alignItems: 'center',
    marginTop: 80,
  },
  backbutton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backText: {
      fontSize: 20,
      fontFamily: 'NanumSquareEB',
      color: '#06A4FD',
      marginRight: 4,
      marginLeft: 14,
  },
  backIcon: {
      marginRight: 10,
  },
  No_result_icon: {
    marginTop : 24,
    marginBottom : 26
  },
  infoTitle: {
    fontSize: 30,
    fontFamily : 'NanumSquareEB',
    color: 'black',
    marginBottom: 6,

  },
  infoText: {
    fontSize: 18,
    fontFamily : 'NanumSquareEB',
    textAlign: 'center',
    color: 'black',
  },
  middle: {
    alignItems: 'center',
    marginTop: 10
  },
  middleText: {
    fontSize: 14,
    fontFamily : 'NanumSquareB',
    color: 'black',
    textAlign: 'center',
    marginBottom: 0,
  },
  middleText2: {
    fontSize: 13,
    fontFamily : 'NanumSquareEB',
    color: '#06A4FD',
    textAlign: 'center',
    marginBottom: 30,
    marginTop : 2
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily : 'NanumSquareB',
    color: 'black',
    textAlign: 'center',
    marginTop : 1
  },
  job5: {
    width: 300,
    height: 60,
    resizeMode: 'contain',
    marginTop: 10,
    alignSelf: 'center'
  },
  style1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    marginBottom: 10,
  },
});

export default NoResultsPage;
