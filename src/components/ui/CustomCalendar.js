// CustomCalendar.js
import React from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { View, Text } from 'react-native';

LocaleConfig.locales['kr'] = {
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.'],
    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    today: '오늘'
};

LocaleConfig.defaultLocale = 'kr';

const CustomCalendar = ({...props}) => {

    return (
    <Calendar
        {...props}
        theme={{
            textSectionTitleColor: 'black',
            textDayFontFamily: 'Arial',
            textDayHeaderFontFamily: 'Arial',
            textDayHeaderFontWeight: 'bold'
        }}
    />
    );
};

export default CustomCalendar;