// Reminder.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const Reminder = () => {
    const [nextTodo, setNextTodo] = useState(null);
    const [sameDayCount, setSameDayCount] = useState(0);
    const navigation = useNavigation();

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
                    daysLeft: moment.utc(item.examDate).diff(moment.utc().startOf('day'), 'days')
                })).sort((a, b) => a.daysLeft - b.daysLeft);

                if (sortedTodoList.length > 0) {
                    const nearestTodo = sortedTodoList[0];
                    const nearestDate = moment(nearestTodo.examDate).utc().format('YYYY-MM-DD');
                    const sameDayTodos = sortedTodoList.filter(item => moment(item.examDate).utc().format('YYYY-MM-DD') === nearestDate);
                    
                    setNextTodo(nearestTodo);
                    setSameDayCount(sameDayTodos.length);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchTodos();
    }, []);

    if (!nextTodo) {
        return (
            <View style={styles.container}>
                <Text style={styles.noTodoText}>No upcoming todo items</Text>
            </View>
        );
    }

    const examDate = moment(nextTodo.examDate).utc().format('YYYY-MM-D');
    const daysLeft = nextTodo.daysLeft;

    return (
        <TouchableOpacity onPress={() => navigation.navigate('TodolistDetail', { selectedTodo: nextTodo })}>
            <View style={[styles.container, { borderColor: nextTodo.color || 'blue' }]}>
                <View style={styles.itemLeft}>
                    <View>
                        {sameDayCount > 1 && (
                            <Text style={styles.sameDayCountText}>같은 D-Day 일정이 {sameDayCount}개 있어요.</Text>
                        )}
                        <Text style={styles.examDate}>{examDate}</Text>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{nextTodo.title}</Text>
                        
                        
                   
                    </View>
                </View>
                <Text style={[styles.daysLeft, { color:nextTodo.color || 'black' }]}>D-{daysLeft}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderWidth: 3,
        borderRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        backgroundColor: '#fff',
        margin: 10,
        height: 74,
        
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 6,
    },
    title: {
        fontSize: 20,
        color: 'black',
        fontFamily: 'NanumSquareEB',
        marginRight: 0,
        marginTop: 0,
        maxWidth: '92%',
    },
    examDate: {
        fontSize: 10,
        fontFamily: 'NanumSquareB',
        color: 'black',
        marginTop: 0,
    },
    sameDayCountText: {
        fontSize: 12,
        color: '#06A4FD', 
        fontFamily: 'NanumSquareEB',
    },
    daysLeft: {
        fontSize: 30,
        fontFamily: 'NanumSquareEB',
        marginLeft: 'auto',
    },
    noTodoText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
    },
});

export default Reminder;