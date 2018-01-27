import React, { Component } from 'react';
import styles from './calendarModal.styles';
import { View, Modal, Text, Button } from 'react-native';
import { Calendar} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import moment from 'moment';

LocaleConfig.locales['de'] = {
  monthNames: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
  monthNamesShort: ['Jan','Feb','Mär','Apr','MaiJun','Jul','Aug','Sep','Okt','Nov','Dez'],
  dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  dayNamesShort: ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.']
};

LocaleConfig.defaultLocale = 'de';

export default class CalendarModal extends Component {

    datesOfWeek(date) {
        let start = moment(date).startOf('week').add(1, 'days');
        let end = moment(start).add(4, 'days');
        
        let result = {};
        for (var m = moment(start); m.diff(end, 'days') <= 0; m.add(1, 'days')) {
            result[m.format("YYYY-MM-DD")] = {color: 'green'}
        }
        result[start.format("YYYY-MM-DD")].startingDay = true; 
        result[end.format("YYYY-MM-DD")].endingDay = true;
        return result;
    }

    render() {
        let { date } = this.props;
        return (
          <Modal
              visible={this.props.visible}
              animationType={'slide'}
              transparent={true}
              onRequestClose={() => this.props.selectDate()}
          >
            <View style={styles.modalContainer}>
            <Calendar
                // Initially visible month. Default = Date()
                current={date.format("YYYY-MM-DD")}
                markedDates={this.datesOfWeek(date)}
                markingType={'period'}
                // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                //minDate={'2012-05-10'}
                // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                //maxDate={'2012-05-30'}
                // Handler which gets executed on day press. Default = undefined
                onDayPress={(day) => this.props.selectDate(day)}
                // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                //monthFormat={'yyyy MM'}
                // Handler which gets executed when visible month changes in calendar. Default = undefined
                //onMonthChange={(month) => {console.log('month changed', month)}}
                // Hide month navigation arrows. Default = false
                //hideArrows={true}
                // Replace default arrows with custom ones (direction can be 'left' or 'right')
                //renderArrow={(direction) => (<Arrow />)}
                // Do not show days of other months in month page. Default = false
                hideExtraDays={true}
                // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
                // day from another month that is visible in calendar page. Default = false
                disableMonthChange={true}
                // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
                firstDay={1}
                // Hide day names. Default = false
                //hideDayNames={true}
                // Show week numbers to the left. Default = false
                showWeekNumbers={true}
            />
            </View>
          </Modal>
        );
    }
}