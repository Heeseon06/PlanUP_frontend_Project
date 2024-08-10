// CalendarOnly.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment'; 

const CalendarOnly = ({ navigation }) => {

    const currentDate = moment().format('YYYY-MM-DD');
    const navigateToTodolistCreate = (dateString) => {
        navigation.navigate('TodolistCreate', { selectedDate: dateString });
    };
    return (
        <View style={styles.container}>
            <Calendar
                current={currentDate}
                monthFormat={'yyyy년 MM월'}
                onDayPress={(day) => navigateToTodolistCreate(day.dateString)}
                hideExtraDays={false}
            />
            <View style={styles.container2}>
                <Text style={styles.noScheduleText}>등록된 일정이 없어요.</Text>
                <TouchableOpacity style={styles.addButton} 
                    onPress={() => navigateToTodolistCreate(moment().format('YYYY-MM-DD'))}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        marginVertical: 10,
    },
    container2: {
        alignItems: 'center',

    },
    noScheduleText: {
        fontSize: 16,
        color: '#06A4FD',
        marginVertical: 20,
    },
    addButton: {
        width: 30,
        marginBottom: 20,
        borderRadius: 2,
        backgroundColor: '#06A4FD',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    addButtonText: {
        fontSize: 24,
        color: '#fff',
    },
});

export default CalendarOnly;
