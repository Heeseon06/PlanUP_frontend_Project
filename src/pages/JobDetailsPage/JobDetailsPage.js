import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import SaraminDetails from '../../components/ui/SaraminDetails';
import SaraminCompanyDetails from '../../components/ui/SaraminCompanyDetails';
import WorkNetDetails from '../../components/ui/WorkNetDetails';
import WorkNetCompanyDetails from '../../components/ui/WorkNetCompanyDetails';
import WorkNetCompanyDetailsV2 from '../../components/ui/WorkNetCompanyDetailsV2';
import WorkNetDetailsV2 from '../../components/ui/WorkNetDetailsV2';
import WorkNetDetailsV3 from '../../components/ui/WorkNetDetailsV3';
import WorkNetCompanyDetailsV3 from '../../components/ui/WorkNetCompanyDetailsV3';
import WorkNetMobileDetails from '../../components/ui/WorkNetMobileDetails';
import WorkNetMobileCompanyDetails from '../../components/ui/WorkNetMobileCompanyDetails';
import WorkNetMobileDetailsV2 from '../../components/ui/WorkNetMobileDetailsV2';
import WorkNetMobileCompanyDetailsV2 from '../../components/ui/WorkNetMobileCompanyDetailsV2';
import JobKoreaDetails from '../../components/ui/JobKoreaDetails';
import JobKoreaCompanyDetails from '../../components/ui/JobKoreaCompanyDetails';
import WantedDetails from '../../components/ui/WantedDetails';
import JobPlanetDetails from '../../components/ui/JobPlanetDetails';

import LoadingScreen from '../../components/ui/Loadingpage';

import Saramin_logo from '../../assets/images/saramin_logo.png';
import Jobkorea_logo from '../../assets/images/jobkorea_logo.png';
import Jobplanet_logo from '../../assets/images/jobplanet_logo.png';
import Worknet_logo from '../../assets/images/worknet_logo.png';
import Wanted_logo from '../../assets/images/wanted_logo.png';
import Success from '../../assets/images/success_icon.svg';
import Back from '../../assets/images/back_icon.svg';
import { PY_URL } from '@env';

const JobDetailsPage = ({ route }) => {
    const { url } = route.params;
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [platform, setPlatform] = useState('');
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.post(`${PY_URL}/scrape`, { url });
                if (response.data) {
                    setJobDetails(response.data);
                    if (url.includes('saramin')) {
                        setPlatform('saramin');
                    } else if (url.includes('work')) {
                        if (url.includes('detail/retrivePriEmpDtlView.do')) {
                            setPlatform('worknetV3');
                        } else if (url.includes('empInfoSrch/detail/empDetailAuthView.do')) {
                            setPlatform('worknetV1');
                        } else if (url.includes('empInfoSrch/list/dhsOpenEmpInfoDetail2.do')) {
                            setPlatform('worknetV3');
                        } else if (url.includes('regionJobsWorknet/jobDetailView2.do') && url.includes('srchInfotypeNm=OEW')) {
                            setPlatform('worknetMobileV1');
                        } else if (url.includes('regionJobsWorknet/jobDetailView2.do') && url.includes('srchInfotypeNm=VALIDATION')) {
                            setPlatform('worknetMobileV2');
                        }
                    } else if (url.includes('jobkorea')) {
                        setPlatform('jobkorea');
                    } else if (url.includes('wanted')) {
                        setPlatform('wanted');
                    } else if (url.includes('jobplanet')) {
                        setPlatform('jobplanet');
                    } else {
                        navigation.navigate('NoResultsPage'); // 조건에 맞지 않는 URL일 경우 이동
                        return;
                    }
                } else {
                    navigation.navigate('NoResultsPage'); // 데이터가 없을 경우 이동
                    return;
                }
            } catch (error) {
                console.error('Error fetching job details:', error);
                navigation.navigate('NoResultsPage'); // 오류 발생 시 이동
                return;
            } finally {
                setLoading(false); // 로딩 상태 해제
            }
        };

        fetchJobDetails();
    }, [url]);

    const addToCalendar = () => {
        jobDetails.source = platform;
        navigation.navigate('CalendarPage', { jobDetails });
    };

    if (loading) {
        return (
            // <View style={styles.loaderContainer}>
            //     <ActivityIndicator size="large" color="#0000ff" />
            // </View>
            <LoadingScreen />
        );
    }

    return (
        <View style={styles.container}>
            {/* <TouchableOpacity onPress={addToCalendar} style={styles.calendarButton}>
                <Text style={styles.calendarButtonText}>해당 공고를 캘린더에 추가하기</Text>
            </TouchableOpacity> */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {jobDetails ? (
                    <>
                        {platform === 'saramin' && (
                            <>
                                <TouchableOpacity style={styles.backbutton} onPress={() => navigation.navigate('URLInputPage')}>
                                    <Text style={styles.backText}>다시 입력하기</Text>
                                    <Back width={18} height={18} style={styles.backIcon} />
                                </TouchableOpacity>
                                <View style={styles.header}>
                                    <Success width={60} height={60} style={styles.success} />
                                    <Image style={styles.saramin_logo} source={Saramin_logo} />
                                    <Text style={styles.title}>취업공고를 불러왔어요!</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={styles.addText}>해당 공고를 캘린더에 추가하기</Text>
                                    <TouchableOpacity onPress={addToCalendar} style={styles.addbutton}>
                                        <Text style={styles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <SaraminDetails jobDetails={jobDetails} />
                                <SaraminCompanyDetails jobDetails={jobDetails} />
                            </>
                        )}
                        {platform === 'worknetV1' && (
                            <>
                                <TouchableOpacity style={styles.backbutton} onPress={() => navigation.navigate('URLInputPage')}>
                                    <Text style={styles.backText}>다시 입력하기</Text>
                                    <Back width={18} height={18} style={styles.backIcon} />
                                </TouchableOpacity>
                                <View style={styles.header}>
                                    <Success width={60} height={60} style={styles.success} />
                                    <Image style={styles.worknet_logo} source={Worknet_logo} />
                                    <Text style={styles.title}>취업공고를 불러왔어요!</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={styles.addText}>해당 공고를 캘린더에 추가하기</Text>
                                    <TouchableOpacity onPress={addToCalendar} style={styles.addbutton}>
                                        <Text style={styles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <WorkNetDetails jobDetails={jobDetails} />
                                <WorkNetCompanyDetails jobDetails={jobDetails} />
                            </>
                        )}
                        {platform === 'worknetV2' && (
                            <>
                                <TouchableOpacity style={styles.backbutton} onPress={() => navigation.navigate('URLInputPage')}>
                                    <Text style={styles.backText}>다시 입력하기</Text>
                                    <Back width={18} height={18} style={styles.backIcon} />
                                </TouchableOpacity>
                                <View style={styles.header}>
                                    <Success width={60} height={60} style={styles.success} />
                                    <Image style={styles.worknet_logo} source={Worknet_logo} />
                                    <Text style={styles.title}>취업공고를 불러왔어요!</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={styles.addText}>해당 공고를 캘린더에 추가하기</Text>
                                    <TouchableOpacity onPress={addToCalendar} style={styles.addbutton}>
                                        <Text style={styles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <WorkNetDetailsV2 jobDetails={jobDetails} />
                                <WorkNetCompanyDetailsV2 jobDetails={jobDetails} />
                            </>
                        )}
                        {platform === 'worknetV3' && (
                            <>
                                <TouchableOpacity style={styles.backbutton} onPress={() => navigation.navigate('URLInputPage')}>
                                    <Text style={styles.backText}>다시 입력하기</Text>
                                    <Back width={18} height={18} style={styles.backIcon} />
                                </TouchableOpacity>
                                <View style={styles.header}>
                                    <Success width={60} height={60} style={styles.success} />
                                    <Image style={styles.worknet_logo} source={Worknet_logo} />
                                    <Text style={styles.title}>취업공고를 불러왔어요!</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={styles.addText}>해당 공고를 캘린더에 추가하기</Text>
                                    <TouchableOpacity onPress={addToCalendar} style={styles.addbutton}>
                                        <Text style={styles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <WorkNetDetailsV3 jobDetails={jobDetails} />
                                {/* <WorkNetCompanyDetailsV3 jobDetails={jobDetails} /> */}
                            </>
                        )}
                        {platform === 'worknetMobileV1' && (
                            <>
                                <TouchableOpacity style={styles.backbutton} onPress={() => navigation.navigate('URLInputPage')}>
                                    <Text style={styles.backText}>다시 입력하기</Text>
                                    <Back width={18} height={18} style={styles.backIcon} />
                                </TouchableOpacity>
                                <View style={styles.header}>
                                    <Success width={60} height={60} style={styles.success} />
                                    <Image style={styles.worknet_logo} source={Worknet_logo} />
                                    <Text style={styles.title}>취업공고를 불러왔어요!</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={styles.addText}>해당 공고를 캘린더에 추가하기</Text>
                                    <TouchableOpacity onPress={addToCalendar} style={styles.addbutton}>
                                        <Text style={styles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <WorkNetMobileDetails jobDetails={jobDetails} />
                                <WorkNetMobileCompanyDetails jobDetails={jobDetails} />
                            </>
                        )}
                        {platform === 'worknetMobileV2' && (
                            <>
                                <TouchableOpacity style={styles.backbutton} onPress={() => navigation.navigate('URLInputPage')}>
                                    <Text style={styles.backText}>다시 입력하기</Text>
                                    <Back width={18} height={18} style={styles.backIcon} />
                                </TouchableOpacity>
                                <View style={styles.header}>
                                    <Success width={60} height={60} style={styles.success} />
                                    <Image style={styles.worknet_logo} source={Worknet_logo} />
                                    <Text style={styles.title}>취업공고를 불러왔어요!</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={styles.addText}>해당 공고를 캘린더에 추가하기</Text>
                                    <TouchableOpacity onPress={addToCalendar} style={styles.addbutton}>
                                        <Text style={styles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <WorkNetMobileDetailsV2 jobDetails={jobDetails} />
                                <WorkNetMobileCompanyDetailsV2 jobDetails={jobDetails} />
                            </>
                        )}
                        {platform === 'jobkorea' && (
                            <>
                                <TouchableOpacity style={styles.backbutton} onPress={() => navigation.navigate('URLInputPage')}>
                                    <Text style={styles.backText}>다시 입력하기</Text>
                                    <Back width={18} height={18} style={styles.backIcon} />
                                </TouchableOpacity>
                                <View style={styles.header}>
                                    <Success width={60} height={60} style={styles.success} />
                                    <Image style={styles.jobkorea_logo} source={Jobkorea_logo} />
                                    <Text style={styles.title}>취업공고를 불러왔어요!</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={styles.addText}>해당 공고를 캘린더에 추가하기</Text>
                                    <TouchableOpacity onPress={addToCalendar} style={styles.addbutton}>
                                        <Text style={styles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <JobKoreaDetails jobDetails={jobDetails} />
                                <JobKoreaCompanyDetails jobDetails={jobDetails} />
                            </>
                        )}
                        {platform === 'wanted' && (
                            <>
                                <TouchableOpacity style={styles.backbutton} onPress={() => navigation.navigate('URLInputPage')}>
                                    <Text style={styles.backText}>다시 입력하기</Text>
                                    <Back width={18} height={18} style={styles.backIcon} />
                                </TouchableOpacity>
                                <View style={styles.header}>
                                    <Success width={60} height={60} style={styles.success} />
                                    <Image style={styles.wanted_logo} source={Wanted_logo} />
                                    <Text style={styles.title}>취업공고를 불러왔어요!</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={styles.addText}>해당 공고를 캘린더에 추가하기</Text>
                                    <TouchableOpacity onPress={addToCalendar} style={styles.addbutton}>
                                        <Text style={styles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <WantedDetails jobDetails={jobDetails} />
                            </>
                        )}
                        {platform === 'jobplanet' && (
                            <>
                                <TouchableOpacity style={styles.backbutton} onPress={() => navigation.navigate('URLInputPage')}>
                                    <Text style={styles.backText}>다시 입력하기</Text>
                                    <Back width={18} height={18} style={styles.backIcon} />
                                </TouchableOpacity>
                                <View style={styles.header}>
                                    <Success width={60} height={60} style={styles.success} />
                                    <Image style={styles.jobplanet_logo} source={Jobplanet_logo} />
                                    <Text style={styles.title}>취업공고를 불러왔어요!</Text>
                                </View>
                                <View style={styles.item}>
                                    <Text style={styles.addText}>해당 공고를 캘린더에 추가하기</Text>
                                    <TouchableOpacity onPress={addToCalendar} style={styles.addbutton}>
                                        <Text style={styles.buttonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <JobPlanetDetails jobDetails={jobDetails} />
                            </>
                        )}
                    </>
                ) : (
                    <Text>데이터를 불러오는 중 오류가 발생했습니다.</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: 'NanumSquareEB',
        color: 'black',
        marginBottom: 20,
        textAlign: 'center',
    },
    backbutton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backText: {
        fontSize: 14,
        fontFamily: 'NanumSquareEB',
        color: '#06A4FD',
        marginRight: 4,
    },
    backIcon: {
        marginRight: 10,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    success: {
        marginBottom: 4,
    },
    saramin_logo: {
        width: 120,
        height: 26,
        resizeMode: 'contain',
        marginBottom: 2,
    },
    jobkorea_logo: {
        width: 140,
        height: 40,
        resizeMode: 'contain',
        marginBottom: 2,
    },
    jobplanet_logo: {
        width: 140,
        height: 40,
        resizeMode: 'contain',
        marginBottom: 2,
    },
    worknet_logo: {
        width: 140,
        height: 40,
        resizeMode: 'contain',
        marginBottom: 4,
    },
    wanted_logo: {
        width: 140,
        height: 40,
        resizeMode: 'contain',
        marginBottom: 4,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    addText: {
        fontSize: 18,
        fontFamily: 'NanumSquareEB',
        color: '#06A4FD',
        marginRight: 10,
    },
    addbutton: {
        backgroundColor: '#06A4FD', 
        borderRadius: 1,
        paddingHorizontal: 10,
        paddingVertical: 1,
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        lineHeight: 30,
    },
    calendarButton: {
        backgroundColor: '#0077B6',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e1e1e1',
    },
    calendarButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default JobDetailsPage;
