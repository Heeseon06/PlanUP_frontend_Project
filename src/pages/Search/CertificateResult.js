// CertificateResult.js 
import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import License from '../../assets/images/license_icon.svg';
import HRDK_text from '../../assets/images/HRDK_text_logo.png';
import Zoom from '../../assets/images/zoom_icon.svg';
import moment from 'moment';
import { API_URL } from '@env';

const CertificateResult = ({ route }) => {
  const { certificates } = route.params;
  const [jobName, setJobName] = useState('');
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  const calculateDDay = (examDate) => {
    if (!examDate) return 'N/A';
    const currentDate = new Date();
    const examDateObj = new Date(`${examDate.slice(0, 4)}-${examDate.slice(4, 6)}-${examDate.slice(6, 8)}`);
    const diffTime = examDateObj - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // YYYYMMDD 에서 YYYY-MM-DD 바꾸기 
  const formatDateString = (dateString) => {
    if (!dateString || dateString.length !== 8) return 'N/A';
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
  };

  const handleSearch = async () => {
    try {
      const trimmedJobName = jobName.trim();
      console.log(`Searching for job name: ${trimmedJobName}`);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${API_URL}/certifi/job_name`, 
        { job_name: trimmedJobName },
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

  // 수정된 handleAddPress 함수
  const handleAddPress = (schedule, examType, jobName) => { // jobName 추가
    const examDateString = examType === '필기' ? schedule.필기시험시작일자 : schedule.실기시험시작일자;
    const examDate = moment(examDateString, 'YYYY-MM-DD').toDate();
    navigation.navigate('CertifiCalendar', {
      examDate,
      jobName // jobName 전달
    });
  };

  const renderItem = ({ item }) => {
    const hasValidDDay = item.schedules.some((schedule) => {
      const dDay필기 = calculateDDay(schedule.필기시험시작일자);
      const dDay실기 = calculateDDay(schedule.실기시험시작일자);
      return dDay필기 >= 0 || dDay실기 >= 0;
    });

    if (!hasValidDDay) {
      return null;
    }

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.job_name}</Text>
        <Image source={HRDK_text} style={styles.hrdk} />
        <View style={styles.scheduleContainer}>
          {item.schedules.map((schedule, index) => {
            const 필기시험년도 = schedule.필기시험시작일자.slice(0, 4);
            const 실기시험년도 = schedule.실기시험시작일자.slice(0, 4);
            const dDay필기 = calculateDDay(schedule.필기시험시작일자);
            const dDay실기 = calculateDDay(schedule.실기시험시작일자);

            return (
              <React.Fragment key={index}>
                {dDay필기 >= 0 && (
                  <View style={styles.examBox_1}>
                      <View style={styles.titleContainer}>
                      <Text style={styles.examTitle}>{필기시험년도}년 {item.job_name} {index + 1}회 필기</Text>
                      {/* handleAddPress 함수에 jobName 추가 */}
                      <TouchableOpacity style={styles.addButton} onPress={() => handleAddPress(schedule, '필기', item.job_name)}>
                        <Text style={styles.addButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    {/* YYYY-MM-DD 바꿈 */}
                    <Text style={styles.scheduleText}>원서접수: {formatDateString(schedule.필기시험원서접수시작일자)} ~ {formatDateString(schedule.필기시험원서접수종료일자)}</Text>
                    <Text style={styles.scheduleText1}>합격 발표: {formatDateString(schedule.필기시험합격발표일자)}</Text>
                    <View style={styles.dDayWrapper}>
                      <View style={styles.dDayContainer}>
                        <Text style={styles.dDay}>D-{dDay필기}</Text>
                        {/* 시험 시작 날짜 추가 */}
                        <Text style={styles.examStartDate}>{formatDateString(schedule.필기시험시작일자)}</Text>
                      </View>
                    </View>
                  </View>
                )}
                {dDay실기 >= 0 && (
                  <View style={styles.examBox_2}>
                      <View style={styles.titleContainer}>
                      <Text style={styles.examTitle}>{실기시험년도}년 {item.job_name} {index + 1}회 실기</Text>
                      {/* handleAddPress 함수에 jobName 추가 */}
                      <TouchableOpacity style={styles.addButton} onPress={() => handleAddPress(schedule, '실기', item.job_name)}>
                        <Text style={styles.addButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    {/* YYYY-MM-DD 바꿈 */}
                    <Text style={styles.scheduleText}>원서접수: {formatDateString(schedule.실기시험원서접수시작일자)} ~ {formatDateString(schedule.실기시험원서접수종료일자)}</Text>
                    <Text style={styles.scheduleText1}>합격 발표: {formatDateString(schedule.합격자발표시작일자)}</Text>
                    <View style={styles.dDayWrapper}>
                      <View style={styles.dDayContainer}>
                        <Text style={styles.dDay}>D-{dDay실기}</Text>
                        {/* 시험 시작 날짜 추가 */}
                        <Text style={styles.examStartDate}>{formatDateString(schedule.실기시험시작일자)}</Text>
                      </View>
                    </View>

                  </View>
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>
    );
  };

  // Calculate the count of schedules with valid D-Days
  const validDDayCount = certificates.reduce((count, item) => {
    return count + item.schedules.filter((schedule) => {
      const dDay필기 = calculateDDay(schedule.필기시험시작일자);
      const dDay실기 = calculateDDay(schedule.실기시험시작일자);
      return dDay필기 >= 0 || dDay실기 >= 0;
    }).length;
  }, 0);

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
        {/* <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>검색하기</Text>
        </TouchableOpacity> */}
      </View>
      {/* Display the count of valid schedules */}
      <Text style={styles.resultCount}>총 {validDDayCount}개의 시험이 검색되었어요.</Text>
      <FlatList
        data={certificates}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>※ 검색이 되지 않은 자격증은 자유 일정으로 추가해주세요.</Text>
        <Text style={styles.footerText}>※ 시험이 종료된 시험 일정은 검색되지 않아요.</Text>
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
    marginBottom: 20,
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'NanumSquareEB',
    color: 'black',
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: 'NanumSquareBR',
    paddingLeft: 10, 
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
  button: {
    backgroundColor: '#47BDFF',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'NanumSquareEB',
    marginBottom: 0,
  },
  hrdk: {
    width: 140,
    height: 20,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: 10,
  },
  scheduleContainer: {
    borderTopWidth: 1, // Only one borderTop here
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  examBox_1: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    position: 'relative',
    borderColor: '#06A4FD',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  examBox_2: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    position: 'relative',
    borderColor: '#97E5FF',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  examTitle: {
    flex : 1,
    color: 'black',
    fontSize: 20,
    fontFamily: 'NanumSquareEB',
    marginBottom: 6,
  },
  scheduleText: {
    fontFamily: 'NanumSquareB',
    color: 'black',
    fontSize: 12,
    marginBottom: 2,
  },
  scheduleText1: {
    color: '#06A4FD',
    fontFamily: 'NanumSquareB',
    fontSize: 12,
    marginBottom: 6,
  },
  dDayWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    alignItems: 'center',
  },
  dDayContainer: { 
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  dDay: {
    fontSize: 30,
    color: 'black',
    fontFamily: 'NanumSquareEB',
  },
  examStartDate: { 
    fontSize: 10,
    fontFamily: 'NanumSquareB',
    color: 'black',
    marginTop: -2,
  },
  addButton: {
    top: 0,
    right: 0,
    backgroundColor: '#06A4FD',
    borderRadius: 2,
    width: 24,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCount: {
    fontSize: 16,
    color: "#06A4FD",
    fontFamily: 'NanumSquareEB',
    marginBottom: 24,
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'NanumSquareB',
    color: '#47BDFF',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default CertificateResult;