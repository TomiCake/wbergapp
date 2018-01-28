import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    Button
} from 'react-native';
import { persistStore, persistCombineReducers, autoRehydrate } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import { PersistGate } from 'redux-persist/es/integration/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import devToolsEnhancer from 'remote-redux-devtools';

import authReducer from './src/Login/reducer';
import timetableReducer from './src/TimetableView/reducer';
import LoginBearer from './src/Login/LoginBearer';
import TimetableContainer from './src/TimetableContainer';
import { setCustomText } from 'react-native-global-props';

setCustomText({
    style: {
        fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : 'sans-serif-light',
        color: 'black'
    }
});

const config = {
    key: 'root',
    storage,
    debug: true,
    version: 1,
}

const reducer = persistCombineReducers(config, {
    auth: authReducer,
    timetable: timetableReducer,
});

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const persistor = persistStore(store);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate
                    loading={<ActivityIndicator></ActivityIndicator>}
                    persistor={persistor}>

                    <LoginBearer>
                        <TimetableContainer />
                    </LoginBearer>

                </PersistGate>
            </Provider>
        );
    }
}
