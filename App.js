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
import TimetableView from './src/TimetableView';

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

const store = createStore(reducer, devToolsEnhancer());
const persistor = persistStore(store);


export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate
                    loading={<ActivityIndicator></ActivityIndicator>}
                    persistor={persistor}>

                    <LoginBearer>
                        <Button
                            title="safd"
                            onPress={() => store.dispatch({type: 'SET_TOKEN', token: null})}>
                        </Button>
                        <TimetableView />
                    </LoginBearer>

                </PersistGate>
            </Provider>
        );
    }
}
