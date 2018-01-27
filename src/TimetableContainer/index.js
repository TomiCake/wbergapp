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
    someEvent() {
      // call navigate for AppNavigator here:
      this.navigator && this.navigator.dispatch(
        NavigationActions.navigate({ routeName: someRouteName })
      );
    }
    render() {
      return (
        <ModalStack ref={nav => { this.navigator = nav; }} />
      );
    }
  }

  export default TimetableContainer