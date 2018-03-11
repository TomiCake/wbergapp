import React, { Component } from 'react';
import { NavigationActions, StackNavigator, DrawerNavigator } from 'react-navigation';
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

const MainView = DrawerNavigator({
    Timetable: {
        screen: ModalStack,
    },
});
export default appConfig.mode === 'app' ? MainView : TimetableViewPublic;
