// TodolistnCalendar.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarOnly from './CalendarOnly';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import VirtualizedView from '../../utils/VirutalizedList';
import CustomCalendar from './CustomCalendar';
import Licenseimg from '../../assets/images/license_icon.svg'
import Userimg from '../../assets/images/user_todo_icon.svg'
import Jobimg from '../../assets/images/main_top_Logo.svg'
import Checkimg from '../../assets/images/check.svg'
import { API_URL } from '@env';

const TodolistCalendar = ({ navigation }) => {
    const currentDate = moment().utc().format('YYYY-MM-DD');
    const [todoList, setTodoList] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const isFocused = useIsFocused();
    const [checklistCounts, setChecklistCounts] = useState({});

    useEffect(() => {
        const fetchTodos = async () => {
            const token = await AsyncStorage.getItem('token');
            try {
                const response = await axios.get(`${API_URL}/list/userid`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const sortedTodoList = response.data.map(item => ({
                    ...item,
                    daysLeft: moment(item.examDate).utc().diff(moment(), 'days')
                })).sort((a, b) => a.daysLeft - b.daysLeft);
                
                // 디데이가 0보다 작은 항목을 삭제하는 코드 추가
                for (const item of sortedTodoList) {
                    if (item.daysLeft < 0) {
                        await axios.delete(`${API_URL}/list/delete/${item._id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                    }
                }

                // 다시 가져와서 삭제된 항목을 제외한 리스트로 설정
                const refreshedResponse = await axios.get(`${API_URL}/list/userid`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const refreshedTodoList = refreshedResponse.data.map(item => ({
                    ...item,
                    daysLeft: moment.utc(item.examDate).diff(moment.utc().startOf('day'), 'days')
                })).sort((a, b) => a.daysLeft - b.daysLeft);

                setTodoList(refreshedTodoList);
            } catch (error) {
                console.error(error);
            }
        };

        fetchTodos();
    }, [isFocused]);

    // ========================================================================

    const markedDates = {};
    todoList.forEach(item => {
        // const dateKey = moment(item.examDate).format('YYYY-MM-DD');
        const dateKey = moment(item.examDate).utc().format('YYYY-MM-DD'); // 시간 정보 제거
        if (!markedDates[dateKey]) {
            markedDates[dateKey] = { dots: [] };
        }
        markedDates[dateKey].dots.push({
            key: item.id,
            color: item.color || 'red',
            selectedDotColor: item.color || 'red',
        });
    });
        

    

  const handleTodoPress = (item) => {
    // 일정 클릭 시 navigation을 이용하여 상세 페이지로 이동
    navigation.navigate('TodolistDetail', { selectedTodo: item });
};

const fetchChecklistCount = async (todoId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_URL}/checklist/${todoId}/count`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data.count;
    } catch (error) {
        console.error(`Error fetching checklist count for todoId ${todoId}:`, error);
        return 0;
    }
};

useEffect(() => {
    const fetchChecklistCounts = async () => {
        const counts = {};
        await Promise.all(
            todoList.map(async (item) => {
                const count = await fetchChecklistCount(item._id);
                counts[item._id] = count;
            })
        );
        setChecklistCounts(counts);
    };

    fetchChecklistCounts();
}, [todoList]);

const renderTodo = ({ item }) => {
    // const examDate = moment(item.examDate);
    const examDate = moment(item.examDate).utc(); // 시간 정보 제거
    const formattedDate = examDate.format('YYYY년 M월 D일');
    const daysLeft = item.daysLeft;
    const type = item.type;
    const count = checklistCounts[item._id] || 0;

    return (
        <TouchableOpacity onPress={() => handleTodoPress(item)}>
            <View style={styles.item}>
                <View style={styles.itemLeft}>
                    <View style={[styles.circle, { backgroundColor: item.color || 'blue' }]} />
                    <View style={{ width: '80%' }}>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
                        <View style={styles.typeContainer}>
                            {type === '0' ? <Userimg width={15} height={15} marginRight={5} /> : type === '1' ? <Licenseimg width={15} height={15} marginRight={5} /> : <Jobimg width={15} height={15} marginRight={5} />}
                            <Text style={styles.examDate}>{formattedDate}</Text>
                            {count > 0 && (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Checkimg width={15} height={15} marginRight={5}/>
                                    <Text>{count}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
                <Text style={styles.daysLeft}>D-{daysLeft}일</Text>
            </View>
        </TouchableOpacity>
    );
};

    const displayedTodoList = showAll ? todoList : todoList.slice(0, 4);
    

    return (
        <View style={styles.card}>
            <VirtualizedView>
                <View style={styles.container}>
                    <CustomCalendar
                        style={styles.calendar}
                        current={currentDate}
                        monthFormat={'yyyy년 MM월'}
                        onDayPress={(day) => navigation.navigate('TodolistCreate', { selectedDate: day.dateString })}
                        markedDates={markedDates}
                        markingType={'multi-dot'}
                        
                    />
                    <View style={styles.todoListHeader}>
                        <Text style={styles.todoListTitle}>등록된 모든 일정 | {todoList.length}개</Text>
                    </View>
                    <FlatList
                        data={displayedTodoList}
                        renderItem={renderTodo}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    {!showAll && todoList.length > 4 && (
                        <TouchableOpacity onPress={() => setShowAll(true)}>
                            <Text style={styles.moreText}>..더보기</Text>
                        </TouchableOpacity>
                    )}
                    {showAll && (
                        <TouchableOpacity onPress={() => setShowAll(false)}>
                            <Text style={styles.moreText}>접기</Text>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.footerText}>일정이 지난 Todo list는 자동으로 삭제돼요.</Text>
                </View>
            </VirtualizedView>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 30,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    calendar: {
        marginBottom: 20,
    },
    todoIcon: {
        width: 20,
        height: 20,
    },
    todoListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    todoListTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#06A4FD',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
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
        fontFamily: 'NanumSquareEB',
        color: 'black',
        width: '100%',
    },
    examDate: {
        fontSize: 13,
        fontFamily: 'NanumSquareR',
        color: '#888',
        marginRight: 10,
    },
    daysLeft: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    footerText: {
        fontSize: 13,
        fontFamily: 'NanumSquareB',
        color: '#06A4FD',
        marginTop: 34,
        marginBottom: 20,
        textAlign: 'center',
    },
    moreText: {
        fontSize: 16,
        fontFamily: 'NanumSquareEB',
        color: '#06A4FD',
        textAlign: 'center',
        marginVertical: 10,
        marginTop: 20,
    },

    typeContainer: {
        alignItems: 'center',
        flexDirection: 'row',
    }
});

export default TodolistCalendar;