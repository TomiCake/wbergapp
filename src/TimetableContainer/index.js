import React, { Component } from 'react';
import { NavigationActions, StackNavigator } from 'react-navigation';
import TimetableView from '../TimetableView';
import SearchView from '../SearchView';

const ModalStack = StackNavigator({
    Timetable: {
        path: 'timetable',
        screen: TimetableView
    },
    Search: {
        path: 'search',
        screen: SearchView,
    },
});

class TimetableContainer extends Component {
    render() {
        return (
            <ModalStack ref={nav => { this.navigator = nav; }} />
        );
    }
}

export default TimetableContainer;