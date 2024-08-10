import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, FlatList, Image, Linking, ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import CustomCalendar from '../../components/ui/CustomCalendar';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import Edit_icon from '../../assets/images/edit_icon.svg';
import Delelte_icon from '../../assets/images/delete_circle_icon.svg';
import Home_icon from '../../assets/images/home_icon.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import {API_URL} from '@env';



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

const toastConfig = {
    Error: (props) => (
        <ErrorToast
            {...props}
            style={{ borderLeftColor: 'red' }}
            text1Style={{ fontSize: 17 }}
            text2Style={{ fontSize: 15 }}
            visibilityTime={3000}
        />
    )
};

const COLORS = ['#06A4FD', '#97E5FF', '#FF0000', '#FF81EB', '#FF8E25', '#FFE871', '#70FF4D', '#35F2DC', '#48B704', '#8206FD'];

const TodolistDetail = ({ route, navigation }) => {
    const { selectedTodo } = route.params;
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState('');
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [checklists, setChecklists] = useState([]);
    const [checklistItem, setChecklistItem] = useState('');
    const [isAddingChecklist, setIsAddingChecklist] = useState(false);
    const [isDeleting, setIsDeleting] = useState(true);
    const [todo, setTodo] = useState('');
    const [newChecklist, setNewChecklist] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);
    const marked = {};
    marked[selectedDate] = { selected: true, selectedColor: '#06A4FD' };

    useEffect(() => {
        setTitle(selectedTodo.title);
        setText(selectedTodo.text);
        setColor(selectedTodo.color);
        setTodo(selectedTodo._id);
        setSelectedDate(moment(selectedTodo.examDate).format('YYYY-MM-DD'));
        setChecklistItem('');
        
        fetchChecklist();
        fetchJobDetails();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const fetchChecklist = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            const todoID = selectedTodo._id;
            const response = await axios.post(
                `${API_URL}/checklist/getByTodoId`,
                { todoId: todoID },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const checklistItems = response.data
                .map(item => ({
                    id: item._id,
                    text: item.list,
                    date: moment(item.examDate).format('YYYY년 M월 D일'),
                    color: item.color,
                    completed: item.completed,
                }))
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            const sortedChecklist = [
                ...checklistItems.filter(item => !item.completed),
                ...checklistItems.filter(item => item.completed)
            ];

            setChecklists(sortedChecklist);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchJobDetails = async () => {
        const token = await AsyncStorage.getItem('token');
        try {
            console.log('Fetching job details for todo ID:', selectedTodo._id);
            const response = await axios.get(`${API_URL}/jobPostings/todo/${selectedTodo._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Job Details Response:', response.data);
            if (response.status === 200 && response.data) {
                setJobDetails(response.data);
            } else {
                console.log('No job details found or error occurred');
            }
        } catch (error) {
            console.error('Error fetching job details:', error.response || error);
        }
    };

    const handleDelete = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            
            // 일정 삭제
            const todoResponse = await axios.delete(`${API_URL}/list/delete/${selectedTodo._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // 채용 공고 삭제 (TodoId 사용)
            try {
                const jobResponse = await axios.delete(`${API_URL}/jobPostings/todo/${selectedTodo._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('채용 공고 삭제 성공:', jobResponse.data);
            } catch (jobError) {
                if (jobError.response && jobError.response.status !== 404) {
                    throw jobError;
                }
                console.log('채용 공고가 이미 삭제되었거나 존재하지 않습니다.');
            }

            if (todoResponse.status === 200) {
                Alert.alert('삭제 완료', '일정과 관련 채용 공고가 삭제되었습니다.');
                navigation.navigate('MainPage');
            }
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            Alert.alert('오류', '일정 삭제 중 문제가 발생했습니다.');
        }
    }

    const handleGoToMainPage = () => {
        navigation.navigate('MainPage');
    };
    
    const showToast = () => {
        Toast.show({
            type: 'Error',
            text1: '현재 읽기 전용 상태입니다.',
            text2: '수정을 원하시면 수정 버튼을 눌러주세요.',
            visibilityTime: 3000,
        });
    }  

    const handleSave = async () => {
        if (title.trim() === '' || text.trim() === '') {
            Alert.alert('Error', 'Please fill out all fields');
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put(`${API_URL}/list/update`, {
                id: todo,
                title: title,
                text: text,
                color: color,
                examDate: selectedDate,
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                Alert.alert('일정 수정', '수정이 완료되었어요.');
                const todoId = response.data._id
                await saveChecklistItems(todoId);
                await updateExistingChecklistItems();
                setIsDeleting(true);
            } else {
                Alert.alert('Error', 'Failed to add todo');
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
            const newChecklistItem = { date:moment(selectedDate).format('YYYY년 M월 D일'), color:color ,text: checklistItem, completed: false };
            setChecklists([...checklists, newChecklistItem]);
            setNewChecklist([...newChecklist, newChecklistItem]);
            setChecklistItem('');
            setIsAddingChecklist(false);
        }
    };

    const saveChecklistItems = async (todoId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            for (const item of newChecklist) {
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

    const updateExistingChecklistItems = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            for (const item of checklists) {
                if (!newChecklist.includes(item)) {
                    const response = await axios.put(`${API_URL}/checklist/update`, {
                        id: item.id,
                        color: item.color,
                        examDate: selectedDate,
                        completed: item.completed,
                        list: item.text
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (response.status !== 200) {
                        Alert.alert('Error', 'Failed to update checklist item');
                        return;
                    }
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while updating the checklist item');
        }
    };

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
            
            setChecklists(prevChecklists =>
                prevChecklists.map(item =>
                    item.id === id ? { ...item, completed: newValue } : item
                ).sort((a, b) => {
                    if (a.completed === b.completed) {
                        return new Date(a.date) - new Date(b.date);
                    }
                    return a.completed - b.completed;
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleColorChange = (newColor) => {
        setColor(newColor);
        setChecklists(checklists.map(item => ({ ...item, color: newColor })));
    };
    
    const handleSelectDate = (date) => {
        setSelectedDate(date);
        const formattedDate = moment(date).format('YYYY년 M월 D일');
        setChecklists(prevChecklists => 
            prevChecklists.map(item => ({ ...item, date: formattedDate }))
        );
        setNewChecklist(prevNewChecklist => 
            prevNewChecklist.map(item => ({ ...item, date: formattedDate }))
        );
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <CustomCalendar
                        style={styles.calendar}
                        current={selectedDate}
                        onDayPress={isDeleting ? showToast : (day) => handleSelectDate(day.dateString)}
                        markingType={'multi-dot'}
                        markedDates={marked}
                        monthFormat={'yyyy년 MM월'}
                    />
    
                    <View style={styles.colorPicker}>
                        {COLORS.map((c, index) => (
                            <TouchableOpacity key={index} onPress={isDeleting ? showToast : () => handleColorChange(c)} style={[styles.colorCircle, { backgroundColor: c, borderColor: color === c ? 'black' : 'transparent' }]} />
                        ))}
                    </View>
                    <View style={styles.eventDetail}>
                        <View style={styles.dateContainer}>
                            <Text style={styles.eventDate}>
                                <View style={[styles.circle, { backgroundColor: color }]} />
                                <Text>  </Text>
                                {moment(selectedDate).locale('ko').format('YYYY년 M월 D일')}
                                <Text style={styles.checklistCount}> ({checklists.length})</Text>
                            </Text>
                            <TouchableOpacity style={styles.editButton} 
                                onPress={() => setIsDeleting(prev => !prev)}
                            >
                                <Edit_icon width={28} height={28} style={styles.edit_icon} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.text1}>제목</Text>
                        <TextInput
                            style={styles.inputTitle}
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChangeText={setTitle}
                            editable={!isDeleting}
                        />
                        <Text style={styles.text1}>상세내용</Text> 
                        <TextInput
                            style={styles.input}
                            placeholder="상세내용을 입력하세요"
                            value={text}
                            onChangeText={setText}
                            multiline
                            editable={!isDeleting}
                        />
                        <View style={styles.checklistContainer}>
                            <Text style={styles.text2}>Check List</Text>
                            <TouchableOpacity 
                                style={[isDeleting ? styles.disabledAddButton1 : styles.addButton1]} 
                                onPress={isDeleting ? showToast : handleAddChecklistItem}
                            >
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
                            data={checklists}
                            renderItem={({ item }) => (
                                <ChecklistItem
                                    title={item.text}
                                    date={item.date}
                                    color={item.color}
                                    completed={item.completed}
                                    onValueChange={(value) => handleToggleCheckbox(item.id, value)}
                                />
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <View>    
                            {isDeleting ? (
                                <View style={styles.style1}>
                                    <Text style={styles.deltext}>일정삭제하기</Text>
                                    <TouchableOpacity onPress={handleDelete}>
                                        <Delelte_icon width={24} style={styles.delete_icon} />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.style1}>
                                    <Text style={styles.text3}>일정수정하기</Text>
                                    <TouchableOpacity style={styles.addButton2} onPress={handleSave}>
                                        <Text style={styles.addButtonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                    <View style={styles.style1}>
                        <TouchableOpacity onPress={handleGoToMainPage}>
                            <Home_icon width={30} height={30} />
                        </TouchableOpacity>
                    </View>
                    {jobDetails && (
                        <View style={styles.jobDetailsContainer}>
                            <Text style={styles.jobDetailsTitle}>{jobDetails.title}</Text>
                            <View style={styles.jobInfoRow}>
                                <Text style={styles.jobDetailsCompany}>{jobDetails.company}</Text>
                                <Image
                                    source={{ uri: jobDetails.회사로고 }}
                                    style={styles.jobDetailsLogo}
                                />
                            </View>
                            <Text style={styles.jobDetailsDeadline}>마감일: {jobDetails.deadline}</Text>
                            <TouchableOpacity 
                                style={styles.jobDetailsButton} 
                                onPress={() => Linking.openURL(jobDetails.URL)}
                            >
                                <Text style={styles.jobDetailsButtonText}>자세히 보기</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
            <Toast config={toastConfig} />
        </SafeAreaView>
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
        marginBottom: 8,
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
    inputTitle: {
        height: 40,
        borderColor: '#C8C8C8',
        borderBottomWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 8,
        fontFamily: 'NanumSquareEB',
        fontSize: 18,
    },
    checklistContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 14,
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
        fontSize: 16,
        fontFamily: 'NanumSquareEB',
        marginRight: 10,
    },
    addButton1: {
        backgroundColor: '#06A4FD',
        height: 25,
        width: 25,
        borderRadius: 3,
        alignItems: 'center',
    },
    disabledAddButton1: {
        backgroundColor: '#06A4FD',
        height: 25,
        width: 25,
        borderRadius: 3,
        alignItems: 'center',
    },
    text3: {
        color: '#06A4FD',
        fontSize: 15,
        fontFamily: 'NanumSquareEB',
        marginRight: 10,
    },
    style1: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
        marginBottom: 20,
    },
    addButton2: {
        backgroundColor: '#06A4FD',
        width: 24,
        height: 24,
        borderRadius: 20,
        alignItems: 'center',
        marginLeft: -2,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        marginTop: 1,
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
        fontFamily: 'NanumSquareEB',
        fontSize: 14,
    },
    deltext: {
        color: 'red',
        fontSize: 15,
        fontFamily: 'NanumSquareEB',
        marginRight: 10,
    },
    delete_icon: {
        marginLeft: -2,
        marginTop: 0,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    editButton: {
        alignItems: 'center',
        marginLeft: 8,
    },
    edit_icon: {
        marginTop: -8,
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
    jobDetailsContainer: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginTop: 20,
        marginBottom: 20,
        marginHorizontal: 10,
    },
    jobDetailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    jobInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    jobDetailsCompany: {
        fontSize: 16,
        color: '#666',
    },
    jobDetailsDeadline: {
        fontSize: 14,
        color: '#e74c3c',
        marginBottom: 10,
    },
    jobDetailsButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    jobDetailsButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    jobDetailsLogo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
});

export default TodolistDetail;