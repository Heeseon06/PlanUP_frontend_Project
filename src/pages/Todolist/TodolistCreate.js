import React, { useState, useEffect,} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, FlatList, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import VirtualizedView from '../../utils/VirutalizedList';
import CustomCalendar from '../../components/ui/CustomCalendar';
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

const TodolistCreate = ({ route, navigation }) => {
  const { selectedDate: initialSelectedDate } = route.params;
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [todoList, setTodoList] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [checklistItem, setChecklistItem] = useState('');
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log(token)
        const response = await axios.get(`${API_URL}/list/userid`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTodoList(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTodos();
  }, []);     

  const handleSave = async () => {
    if (title.trim() === '' || text.trim() === '') {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }
    setIsButtonDisabled(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${API_URL}/list`, {
        userid: user.userid,
        title: title,
        text: text,
        color: color,
        // examDate: selectedDate,
        examDate: moment(selectedDate).locale('ko').format('YYYY-MM-DD'), // 날짜를 저장할 때 시간 제거
        type: '0',
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        Alert.alert('성공', '일정 추가 성공');
        console.log(response.data)
        const todoId = response.data
        await saveChecklistItems(todoId);
        navigation.navigate('MainPage');
      } else {
        Alert.alert('Error', 'Failed to add todo');
        setIsButtonDisabled(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding the todo');
    }
  };

  const handleAddChecklistItem = () => {
    setIsAddingChecklist(true);
  };

  const handleSaveChecklistItem = () => {
    if (checklistItem.trim() !== '') {
      const newChecklistItem = { date:moment(selectedDate).locale('ko').format('YYYY년 M월 D일'), color: color, text: checklistItem, completed: false };
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
          examDate: selectedDate,
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

  const markedDates = {};
  todoList.forEach(item => {
    const dateKey = moment(item.examDate).format('YYYY-MM-DD');
    if (!markedDates[dateKey]) {
        markedDates[dateKey] = { dots: [] };
    }
    markedDates[dateKey].dots.push({
        key: item.id,
        color: item.color || 'red',
        selectedDotColor: item.color || 'red',
    });
});

const handleColorChange = (newColor) => {
  setColor(newColor);
  setChecklist(checklist.map(item => ({ ...item, color: newColor })));
};

const handleSelectDate = (date) => {
  setSelectedDate(date);
  setChecklist(checklist.map(item => ({ ...item, date: moment(date).locale('ko').format('YYYY년 M월 D일') })));
}

  markedDates[selectedDate] = { selected: true, selectedColor: '#06A4FD' };

  return (
    <ScrollView>
      <View style={styles.container}>
        <CustomCalendar
          style={styles.calendar}
          current={selectedDate}
          onDayPress={(day) => handleSelectDate(day.dateString)}
          markingType={'multi-dot'}
          markedDates={markedDates}
          monthFormat={'yyyy년 MM월'}
        />
        <View style={styles.colorPicker}>
          {COLORS.map((c, index) => (
            <TouchableOpacity key={index} onPress={() => handleColorChange(c)} style={[styles.colorCircle, { backgroundColor: c, borderColor: color === c ? 'black' : 'transparent' }]} />
          ))}
        </View>
        <View style={styles.eventDetail}>
          <View style={styles.dateContainer}>
            <View style={[styles.circle, { backgroundColor: color }]} />
            <Text></Text>
            <Text style={styles.eventDate}>
              {moment(selectedDate).locale('ko').format('YYYY년 M월 D일')}
              <Text style={styles.checklistCount}> ({checklist.length})</Text>
            </Text>
          </View>
          <Text style={styles.text1}>제목</Text>
          <TextInput
            style={styles.input}
            placeholder="제목을 입력하세요."
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.text1}>상세내용</Text> 
          <TextInput
            style={styles.input}
            placeholder="상세내용을 입력하세요."
            value={text}
            onChangeText={setText}
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
                style={styles.input}
                placeholder="체크리스트 항목 입력"
                value={checklistItem}
                onChangeText={setChecklistItem}
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveChecklistItem}>
                <Text style={styles.saveButtonText}>저장</Text>
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
        <View style={styles.style1}>
          <Text style={[styles.text3, isButtonDisabled && styles.disabledText3]}>일정추가하기</Text>
          <TouchableOpacity 
          style={[styles.addButton2, isButtonDisabled && styles.disabledButton]} 
          onPress={handleSave}
          disabled={isButtonDisabled}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',

},
  calendar: {
    marginBottom: 16,
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 8,
    marginRight: 8,
  },
  eventDate: {
    fontSize: 18,
    fontFamily: 'NanumSquareEB',
    color: 'black',
    marginBottom: 14,
  },
  checklistCount: {
    fontSize: 14,
    color: 'gray',
  },
  text1: {
    color: '#C8C8C8',
    fontFamily: 'NanumSquareEB',
    marginBottom: 5,
    marginTop: 6,
  },
  input: {
    height: 'auto',
    borderColor: '#C8C8C8',
    borderBottomWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 8,
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
    // padding: 10,
    height: 25,
    width: 25,
    borderRadius: 3,
    alignItems: 'center',
  },
  text3: {
    color: '#06A4FD',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 10,
  },
  disabledText3: {
    color: '#A9A9A9',
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 10,
  },
  style1:{
    flexDirection:'row',
    alignItems:"center",
    justifyContent:"center",
    marginTop: 20,
    marginBottom: 20,
  },
  addButton2: {
  backgroundColor: '#06A4FD',
  // padding: 5,
  width: 25,
  height: 25,
  borderRadius: 20,
  alignItems: 'center',
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
    marginLeft: 8,
  },
  saveButtonText: {
    color: 'white',
    fontFamily: 'NanumSquareB',
    fontSize: 14,
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
});

export default TodolistCreate;