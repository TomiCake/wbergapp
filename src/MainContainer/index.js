import React, { Component } from 'react';
import { NavigationActions, StackNavigator } from 'react-navigation';
import TimetableView from '../TimetableView';
import TimetableViewPublic from '../TimetableView/index.public';
import SearchView from '../SearchView';
import appConfig from '../appConfig';

const ModalStack = StackNavigator({
    Timetable: {
        path: 'timetable',
        screen: TimetableView,        
    },
    Search: {
        path: 'search',
        screen: SearchView,
    },
});

class MainView extends Component {
    render() {
        return (
            <ModalStack ref={nav => { this.navigator = nav; }} />
        );
    }
}
export default appConfig.mode === 'app' ? MainView : TimetableViewPublic;
