import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, FlatList, Image } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import SaraminDetails from '../../components/ui/SaraminDetails';
import WorkNetDetails from '../../components/ui/WorkNetDetails';
import WorkNetDetailsV2 from '../../components/ui/WorkNetDetailsV2';
import WorkNetDetailsV3 from '../../components/ui/WorkNetDetailsV3';
import WorkNetMobileDetails from '../../components/ui/WorkNetMobileDetails';
import WorkNetMobileDetailsV2 from '../../components/ui/WorkNetMobileDetailsV2';
import JobKoreaDetails from '../../components/ui/JobKoreaDetails';
import WantedDetails from '../../components/ui/WantedDetails';
import JobPlanetDetails from '../../components/ui/JobPlanetDetails';
import Home_icon  from '../../assets/images/home_icon.svg';
import Edit_icon from '../../assets/images/edit_icon.svg';
import Delelte_icon from '../../assets/images/delete_circle_icon.svg';
import { API_URL } from '@env';

const COLORS = ['#06A4FD', '#97E5FF', '#FF0000', '#FF81EB', '#FF8E25', '#FFE871', '#70FF4D', '#35F2DC', '#48B704', '#8206FD'];

const ChecklistItem = ({ title, date, color, completed, onValueChange }) => (
  <View style={styles.item}>
    <View style={styles.itemLeft}>
      <View style={[styles.circle, { backgroundColor: color || 'blue' }]} />
      <View>
        <Text style={[styles.title, completed && styles.checklistItemCompleted]}>{title}</Text>
        <Text style={[styles.date, completed && styles.checklistItemCompleted]}>{date}까지</Text>
      </View>
    </View>
    <CheckBox value={completed} onValueChange={onValueChange} /> 
  </View>
);

const CalendarPage = ({ route, navigation }) => {
  const { jobDetails } = route.params;
  const { user } = useAuth();
  const [eventDate, setEventDate] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [color, setColor] = useState(COLORS[0]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [checklist, setChecklist] = useState([]);
  const [checklistItem, setChecklistItem] = useState('');
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [jobPosts, setJobPosts] = useState([]);
  const [showComponent, setShowComponent] = useState(false);
  const [ComponentToShow, setComponentToShow] = useState(null);
  const [showExtraButtons, setShowExtraButtons] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [jobPostId, setJobPostId] = useState(null);  // 채용 공고 ID 저장용 상태 추가

  useEffect(() => {
    if (jobDetails) {
      console.log('Job Details:', jobDetails);  // 디버깅을 위한 로그
      setEventTitle(jobDetails.직무 || '');
      const formattedDate = formatDate(jobDetails.마감일);
      setEventDate(formattedDate);
      setMarkedDates({
        [formattedDate]: { selected: true, marked: true, selectedColor: 'blue' }
      });
      determineComponentToShow();
    }
  }, [jobDetails]);

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  const formatDate = (date) => {
    if (!date) return moment().format('YYYY-MM-DD');
    const parsedDate = moment(date, 'YYYY.MM.DD HH:mm');
    return parsedDate.isValid() ? parsedDate.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
  };

  const handleSaveEvent = async () => {
    if (eventTitle.trim() === '' || eventDescription.trim() === '') {
      Alert.alert('Error', '모든 필드를 채워주세요');
      return;
    }
    setIsButtonDisabled(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${API_URL}/list`, {
        userid: user.userid,
        title: eventTitle,
        text: eventDescription,
        color: color,
        examDate: eventDate,
        type: '2'
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        Alert.alert('성공', '일정이 저장되었습니다.');
        console.log('일정 저장 성공: ', response.data);
        const todoId = response.data;
        setSelectedTodo(todoId);
        await saveChecklistItems(todoId);

         // 새로운 컬렉션에 채용 공고 저장
         const jobPostResponse = await axios.post(`${API_URL}/jobPostings`, {
          title: eventTitle,
          company: jobDetails.회사명,
          deadline: eventDate,
          userid: user.userid,
          URL: jobDetails.URL, // 채용 공고 URL 추가
          회사로고: jobDetails.회사로고, // 회사 로고 추가
          todoId:todoId
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (jobPostResponse.status === 201) {
          setJobPosts([...jobPosts, { title: eventTitle, company: jobDetails.회사명, deadline: eventDate, URL: jobDetails.URL, 회사로고: jobDetails.회사로고,todoId:todoId }]); // URL과 로고 포함
          setJobPostId(jobPostResponse.data._id);
        } else {
          Alert.alert('오류', '채용 공고 저장에 실패했습니다.');
        }

        setChecklist([]);
        setChecklistItem('');
        setIsAddingChecklist(false);
        setIsButtonDisabled(false);
        setShowComponent(true);
        setShowExtraButtons(true);

      } else {
        Alert.alert('오류', '일정 저장에 실패했습니다.');
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('오류', '일정 저장 중 오류가 발생했습니다.');
      setIsButtonDisabled(false);
    }
  };

  const determineComponentToShow = () => {
    const source = jobDetails.source;
    if (source === 'saramin') {
      setComponentToShow(<SaraminDetails jobDetails={jobDetails} />);
    } else if (source === 'worknetV1') {
      setComponentToShow(<WorkNetDetails jobDetails={jobDetails} />);
    } else if (source === 'worknetV2') {
      setComponentToShow(<WorkNetDetailsV2 jobDetails={jobDetails} />);
    } else if (source === 'worknetV3') {
      setComponentToShow(<WorkNetDetailsV3 jobDetails={jobDetails} />);
    } else if (source === 'worknetMobileV1') {
      setComponentToShow(<WorkNetMobileDetails jobDetails={jobDetails} />);
    } else if (source === 'worknetMobileV2') {
      setComponentToShow(<WorkNetMobileDetailsV2 jobDetails={jobDetails} />);
    } else if (source === 'jobkorea') {
      setComponentToShow(<JobKoreaDetails jobDetails={jobDetails} />);
    } else if (source === 'wanted') {
      setComponentToShow(<WantedDetails jobDetails={jobDetails} />);
    } else if (source === 'jobplanet') {
      setComponentToShow(<JobPlanetDetails jobDetails={jobDetails} />);
    } else {
      setComponentToShow(null);
    }
  };

  const handleAddChecklistItem = () => {
    setIsAddingChecklist(true);
  };

  const handleSaveChecklistItem = () => {
    if (checklistItem.trim() !== '') {
      const newChecklistItem = { color: color, text: checklistItem, completed: false };
      setChecklist([...checklist, newChecklistItem]);
      setChecklistItem('');
      setIsAddingChecklist(false);
    }
  };

  const saveChecklistItems = async (todoId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      for (const item of checklist) {
        const response = await axios.post(`${API_URL}/checklist`, {
          userid: user.userid,
          color: color,
          examDate: eventDate,
          list: item.text,
          completed: item.completed,
          todoId: todoId
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status !== 201) {
          Alert.alert('Error', 'Failed to add checklist item');
          return;
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding the checklist item');
    }
  };

  const handleToggleChecklistItem = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].completed = !newChecklist[index].completed;
    setChecklist(newChecklist);
  };

  const onDayPress = (day) => {
    setEventDate(day.dateString);
    setMarkedDates({
      [day.dateString]: { selected: true, marked: true, selectedColor: 'blue' }
    });
  };

  const handleRelatedSchedule = () => {
    setEventDate('');
    setEventTitle('');
    setEventDescription('');
    setMarkedDates({});
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/list/delete/${selectedTodo}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        Alert.alert('성공', '일정 삭제 성공');
        console.log('삭제성공')
        navigation.navigate('MainPage');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteJobPost = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/jobPostings/${jobPostId}`, {  // jobPostId 사용
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        Alert.alert('성공', '채용 공고 삭제 성공');
        console.log('삭제성공')
      }
    } catch (error) {
      console.error('Error deleting job posting:', error);
    }
  }

  const handleDeleteEvent = () => {
    handleDeleteJobPost();
    handleDelete();
    setEventDate('');
    setEventTitle('');
    setEventDescription('');
    setChecklist([]);
    setMarkedDates({});
    setShowExtraButtons(false);
    setShowComponent(false);
    setSelectedTodo(null);
    setJobPostId(null);  // 초기화
  };

  const handleGoToMainPage = () => {
    navigation.navigate('MainPage');
  };

  return (
    <ScrollView style={styles.container}>
      <Calendar
        initialDate={eventDate}
        onDayPress={onDayPress}
        markedDates={markedDates}
        monthFormat={'yyyy년 MM월'}
      />
      <View style={styles.colorPicker}>
        {COLORS.map((c, index) => (
          <TouchableOpacity key={index} onPress={() => setColor(c)} style={[styles.colorCircle, { backgroundColor: c, borderColor: color === c ? 'black' : 'transparent' }]} />
        ))}
      </View>
      <View style={styles.eventDetail}>
        <View style={styles.dateContainer}>
          <Text style={styles.eventDate}>
            {eventDate ? moment(eventDate).locale('ko').format('YYYY년 M월 D일') : '날짜 선택'}
          </Text>
        </View>
        <Text style={styles.label}>제목</Text>
        <TextInput
          style={styles.input}
          value={eventTitle}
          onChangeText={setEventTitle}
        />
        <Text style={styles.label}>상세내용</Text>
        <TextInput
          style={styles.input2} // input2 스타일 적용
          value={eventDescription}
          placeholder="상세내용을 입력하세요."
          onChangeText={setEventDescription}
          multiline
        />
        <View style={styles.checklistContainer}>
          <Text style={styles.text2}>Check List</Text>
          <TouchableOpacity style={styles.addButton1} onPress={handleAddChecklistItem}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        {isAddingChecklist && (
          <View style={styles.addChecklistContainer}>
            <TextInput
              style={styles.input3} // input3 스타일 적용
              placeholder="체크리스트 항목 입력"
              value={checklistItem}
              onChangeText={setChecklistItem}
            />
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText} onPress={handleSaveChecklistItem}>저장</Text>
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          data={checklist}
          renderItem={({ item, index }) => (
            <ChecklistItem
              title={item.text}
              date={item.date}
              color={item.color}
              isChecked={item.completed}
              onValueChange={() => handleToggleChecklistItem(index)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        {showExtraButtons ? (
          <View style={styles.style1}>
          <Text style={[styles.text4, isButtonDisabled && styles.disabledText3]}>일정삭제하기</Text>
          <TouchableOpacity
            style={[styles.addButton2, isButtonDisabled && styles.disabledButton]}
            onPress={handleDelete}
            disabled={isButtonDisabled}>
            <Delelte_icon width={24} style={styles.delete_icon}></Delelte_icon>
          </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.style1}>
            <Text style={[styles.text3, isButtonDisabled && styles.disabledText3]}>일정추가하기</Text>
            <TouchableOpacity
              style={[styles.addButton2, isButtonDisabled && styles.disabledButton]}
              onPress={handleSaveEvent}
              disabled={isButtonDisabled}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.style1}>
          <TouchableOpacity
            onPress={handleGoToMainPage}>
            <Home_icon width={30} height={30} />
          </TouchableOpacity>
        </View>
      </View>
      {showComponent && ComponentToShow}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  calendar: {
    marginBottom: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 15,
    borderWidth: 2,
  },
  eventDetail: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'NanumSquareEB',
    color: 'black',
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 'auto',
    borderColor: '#C8C8C8',
    borderBottomWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 8,
    fontFamily: 'NanumSquareEB',
    fontSize: 16,
  },
  input2: {
    height: 'auto',
    borderColor: '#C8C8C8',
    borderBottomWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 8,
    fontFamily: 'NanumSquareB',
    fontSize: 15,
  },
  input3: {
    height: 'auto',
    borderColor: '#C8C8C8',
    borderBottomWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 8,
    fontFamily: 'NanumSquareR',
    fontSize: 14,
  },
  checklistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 10,
  },
  addChecklistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checklistItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  checklistItem: {
    fontSize: 16,
  },
  checklistItemCompleted: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  text2: {
    color: '#06A4FD',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 10,
  },
  addButton1: {
    backgroundColor: '#06A4FD',
    height: 25,
    width: 25,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center', // 추가
  },
  text3: {
    color: '#06A4FD',
    fontSize: 15,
    fontFamily: 'NanumSquareEB',
    marginRight: 10,
  },
  text4: {
    color: 'red',
    fontSize: 15,
    fontFamily: 'NanumSquareEB',
    marginRight: 10,
  },
  disabledText3: {
    color: '#A9A9A9',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 10,
  },
  style1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  addButton2: {
    backgroundColor: '#06A4FD',
    width: 23,
    height: 23,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center', // 추가
    marginLeft: -4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#06A4FD',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 5,
  },
  saveButtonText: {
    color: 'white',
    fontFamily: 'NanumSquareB',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  saveEventButton: {
    backgroundColor: '#06A4FD',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center', // 추가
    marginTop: 10,
  },
  saveEventButtonText: {
    color: 'white',
    fontSize: 18, // 업데이트
    fontWeight: 'bold',
  },
  deleteEventButton: {
    backgroundColor: '#06A4FD',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center', // 추가
    marginTop: 10,
  },
  deleteEventButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobDetailsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginBottom: 16,
  },
  jobDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobDetailsCompany: {
    fontSize: 16,
    marginBottom: 8,
  },
  jobDetailsDeadline: {
    fontSize: 14,
    color: 'red',
  },
});

export default CalendarPage;
