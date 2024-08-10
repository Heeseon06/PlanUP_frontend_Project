import React, { useEffect, useState, useRef } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    AppState,
    Dimensions,
    Image,
    Linking,
    Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import TodolistCalendar from '../../components/ui/TodolistCalendar';
import CalendarOnly from '../../components/ui/CalendarOnly';
import Checklist from '../../components/ui/Checklist';
import AddURL from '../../components/ui/AddURL';
import URLonly from '../../components/ui/URLonly';
import Reminder from '../../components/ui/Reminder';
import Swiper from 'react-native-web-swiper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VirtualizedView from '../../utils/VirutalizedList';
import Logo from '../../assets/images/logo.svg';
import { API_URL } from '@env';
import Clipboard from '@react-native-clipboard/clipboard';
import moment from 'moment'; // moment 라이브러리 추가

function MainPage() {
    const { user } = useAuth();
    const [isChecklist, setIsChecklist] = useState(false);
    const [isTodoList, setIsTodoList] = useState(false);
    const [sortedJobPostings, setSortedJobPostings] = useState([]); // 정렬된 채용 정보를 저장할 상태
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [showAllJobs, setShowAllJobs] = useState(false);
    const [displayedJobs, setDisplayedJobs] = useState([]);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                console.log('앱이 포그라운드로 전환됩니다!');
            } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
                console.log('앱이 백그라운드로 전환됩니다!');
            }
            appState.current = nextAppState;
            console.log('AppState', appState.current);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        const fetchChecklist = async () => {
            const token = await AsyncStorage.getItem('token');
            try {
                const response = await axios.get(`${API_URL}/checklist/userid`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIsChecklist(response.data.length > 0);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchTodos = async () => {
            const token = await AsyncStorage.getItem('token');
            try {
                const response = await axios.get(`${API_URL}/list/userid`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIsTodoList(response.data.length > 0);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchJobPostings = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    throw new Error('인증 토큰이 없습니다.');
                }

                const response = await axios.get(`${API_URL}/jobPostings/${user.userid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    const currentDate = moment();
                    const filteredAndSortedJobs = response.data
                        .filter(job => moment(job.deadline).isAfter(currentDate))
                        .sort((a, b) => moment(a.deadline).diff(moment(b.deadline)));
                    setSortedJobPostings(filteredAndSortedJobs);
                    setDisplayedJobs(filteredAndSortedJobs.slice(0, 5)); // 초기에 5개만 표시
                    console.log('Fetched and sorted job postings:', filteredAndSortedJobs);
                } else {
                    throw new Error('채용 공고를 가져오는데 실패했습니다.');
                }
            } catch (error) {
                console.error('Error fetching job postings:', error);
                Alert.alert('오류', '채용 공고를 가져오는데 실패했습니다.');
            }
        };

        fetchChecklist();
        fetchTodos();
        fetchJobPostings();
    }, [isFocused]);

    const toggleJobsDisplay = () => {
        if (showAllJobs) {
            setDisplayedJobs(sortedJobPostings.slice(0, 5));
        } else {
            setDisplayedJobs(sortedJobPostings);
        }
        setShowAllJobs(!showAllJobs);
    };

    const {setIsLoggedIn, setUser } = useAuth();
    const handleLogout = (navigation, setIsLoggedIn, setUser) => {
        Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: () =>  {
                AsyncStorage.removeItem('token')
                    .then(() => {
                        setIsLoggedIn(false);
                        setUser(null);
                        console.log('로그아웃 성공');
                        Alert.alert('로그아웃 성공', '로그아웃 되었습니다.');
                        navigation.navigate('LoginPage');
                    })
                    .catch((error) => {
                        console.error('로그아웃 오류:', error);
                        Alert.alert('로그아웃 오류', '로그아웃 중 오류가 발생했습니다.', error);
                    });
            }}
        ]);
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>사용자 정보를 불러오는 중...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <VirtualizedView>
                <View style={styles.container}>
                <TouchableOpacity 
                onPress={() => handleLogout(navigation, setIsLoggedIn, setUser)}
                style={{ marginRight: 10 }}>
                    <Text style={styles.logout}>로그아웃</Text>
                </TouchableOpacity>
                    <Logo style={styles.logo} width={60} height={80} />
                    <Text style={styles.title}>{user.name}님 안녕하세요!</Text>
                    <Text style={styles.welcome}>목표를 꼭 이루시길 바래요!</Text>

                    <Reminder />

                    {isTodoList ? (
                        <AddURL navigation={navigation} />
                    ) : (
                        <URLonly navigation={navigation} />
                    )}

                    {isTodoList ? (
                        <TodolistCalendar navigation={navigation} />
                    ) : (
                        <CalendarOnly navigation={navigation} />
                    )}
                    {isChecklist && <Checklist />}

                      {/* 채용 정보 표시 */}
<View style={styles.jobcontainer}>
    <Text style={styles.sectionTitle}>나의 취업공고</Text>
    {displayedJobs.map((job) => (
        <View key={job._id} style={styles.jobPosting}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobCompany}>{job.company}</Text>
            <Text style={styles.jobDeadline}>마감: {moment(job.deadline).format('YYYY-MM-DD')}</Text>
            <TouchableOpacity
                style={styles.urlButton}
                onPress={() => Linking.openURL(job.URL)}
            >
                <Text style={styles.urlButtonText}>공고 보기</Text>
            </TouchableOpacity>
        </View>
    ))}
    {sortedJobPostings.length > 5 && (
        <TouchableOpacity onPress={toggleJobsDisplay} style={styles.toggleButton}>
            <Text style={styles.toggleButtonText}>
                {showAllJobs ? '접기' : '더보기'}
            </Text>
        </TouchableOpacity>
    )}
</View>

                    

                     {/*AD*/}
                    <View style={styles.sliderContainer}>
                        <Swiper loop 
                                autoplay 
                                timeout={5} 
                                controlsEnabled 
                                controlsProps={{
                                    prevPos: false,
                                    nextPos: false,
                                    dotsTouchable: true, 
                            }}>
                            <TouchableOpacity style={styles.slide} onPress={() => Linking.openURL('https://www.2024datacontest.co.kr/')}>
                                <Image source={require('../../assets/images/Ad01.png')} style={styles.image} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.slide} onPress={() => Linking.openURL('https://motijobfair.com/')}>
                                <Image source={require('../../assets/images/Ad02.png')} style={styles.image} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.slide} onPress={() => Linking.openURL('https://fome-jobfair.com/main/main.php')}>
                                <Image source={require('../../assets/images/Ad03.png')} style={styles.image} />
                            </TouchableOpacity>
                        </Swiper>
                    </View>
                </View>
            </VirtualizedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingRight: 20,
    },
    logout : {
        fontFamily: 'NanumSquareEB',
        color: '#06A4FD',
        textAlign: 'right',
    },
    logo: {
        alignSelf: 'center',
    },
    title: {
        fontSize: 26,
        fontFamily: 'NanumSquareEB',
        color: 'black',
        marginBottom: 3,
    },
    welcome: {
        fontSize: 16,
        fontFamily: 'NanumSquareR',
        color: 'black',
        marginBottom: 10,
        marginLeft: 3,
    },
    toggleButton: {
        alignItems: 'center',
        padding: 10,
        marginTop: 10,
    },
    urlButton: {
        backgroundColor: '#06A4FD',
        padding: 8,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    urlButtonText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'NanumSquareEB',
    },
    toggleButtonText: {
        color: '#06A4FD',
        fontSize: 16,
        fontFamily: 'NanumSquareEB',
    },
    jobcontainer: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'NanumSquareEB',
        color: '#06A4FD',
        marginVertical: 10,
        marginBottom: 16,
        marginLeft: 8,
    },
    jobPosting: {
        padding: 16,
        borderWidth: 3,
        borderTopColor: '#97E5FF',
        borderLeftColor: '#97E5FF',
        borderRightColor: '#69C9FF',
        borderBottomColor: '#47BDFF',
        borderRadius: 22,
        marginVertical: 5,
    },
    jobTitle: {
        fontSize: 18,
        fontFamily: 'NanumSquareEB',
        color: 'black',
    },
    jobCompany: {
        fontSize: 14,
        fontFamily: 'NanumSquareR',
        color: 'black',
    },
    jobDeadline: {
        fontSize: 14,
        fontFamily: 'NanumSquareR',
        color: 'gray',
        textAlign: 'right',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    sliderContainer: {
        height: 200,
        width: '100%',
        marginBottom: 30,
        marginTop: 30,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 24,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});

export default MainPage;