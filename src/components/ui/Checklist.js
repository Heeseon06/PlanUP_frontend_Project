import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox'; 
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { API_URL } from '@env';

const ChecklistItem = ({ title, date, color, isChecked, onValueChange }) => (
  <View style={styles.item}>
    <View style={styles.itemLeft}>
      <View style={[styles.circle, { backgroundColor: color || 'blue' }]} />
      <View>
        <Text style={[styles.title, isChecked && styles.checklistItemCompleted]}>{title}</Text>
        <Text style={[styles.date, isChecked && styles.checklistItemCompleted]}>{date}까지</Text>
      </View>
    </View>
    <CheckBox value={isChecked} onValueChange={onValueChange} /> 
  </View>
);

const Checklist = ({ navigation }) => {
  const [checklist, setChecklist] = useState([]);
  const [visibleItems, setVisibleItems] = useState(4);
  const [showMore, setShowMore] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    
    const fetchChecklist = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`${API_URL}/checklist/userid`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const checklistItems = response.data
          .filter(item => !item.completed)
          .map(item => ({
            id: item._id,
            title: item.list,
            date: moment(item.examDate).format('YYYY년 M월 D일'),
            color: item.color,
            isChecked: item.completed, 
          }))
          .sort((a, b) => {
            if (a.isChecked === b.isChecked) {
              return new Date(a.date) - new Date(b.date);
            }
            return a.isChecked - b.isChecked;
          });
        setChecklist(checklistItems);
      } catch (error) {
        console.error(error);
      }
    };
    fetchChecklist();
  }, [isFocused]);

  const handleToggleCheckbox = async (id, newValue) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${API_URL}/checklist/updateCompleted`,
        { id,
          completed: newValue 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (newValue === true) {
        // 체크된 항목은 리스트에서 제외
        setChecklist(prevChecklist =>
          prevChecklist.filter(item => item.id !== id)
        );
      } else {
      setChecklist(prevChecklist =>
        prevChecklist.map(item =>
          item.id === id ? { ...item, isChecked: newValue } : item
        ).sort((a, b) => {
          if (a.isChecked === b.isChecked) {
            return new Date(a.date) - new Date(b.date);
          }
          return a.isChecked - b.isChecked;
        })
      );
    }
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowMore = () => {
    setShowMore(true);
  };

  const handleShowLess = () => {
    setShowMore(false);
  };


  return (
    <View style={styles.card}>
      <Text style={styles.header}>Check list</Text>
      <FlatList
        data={showMore ? checklist : checklist.slice(0, visibleItems)}
        renderItem={({ item }) => (
          <ChecklistItem
            title={item.title}
            date={item.date}
            color={item.color}
            isChecked={item.isChecked}
            onValueChange={(value) => handleToggleCheckbox(item.id, value)}
          />
        )}
        keyExtractor={item => item.id}
      />
      {!showMore && checklist.length > visibleItems && (
        <TouchableOpacity style={styles.showMoreButton} onPress={handleShowMore}>
          <Text style={styles.showMoreText}>더보기</Text>
        </TouchableOpacity>
      )}
      {showMore && (
        <TouchableOpacity style={styles.showMoreButton} onPress={handleShowLess}>
          <Text style={styles.showMoreText}>접기</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.footer}>※ 완료된 체크리스트는 자동으로 사라져요.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    fontSize: 18,
    fontFamily: 'NanumSquareEB',
    color: '#06A4FD',
    marginBottom: 10,
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

  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  showMoreButton: {
    padding: 10,
    alignItems: 'center',
  },
  showMoreText: {
    color: '#06A4FD',
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 13,
    color: '#06A4FD',
    fontFamily: 'NanumSquareB',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 14,
  },
  checklistItemCompleted: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});

export default Checklist;
