import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ActivityIndicator
} from 'react-native';
import { PersistGate } from 'redux-persist/es/integration/react';
import { Provider } from 'react-redux';

import LoginBearer from './Login/LoginBearer';
import AnonymousBearer from './Login/AnonymousBearer';
import MainContainer from './MainContainer';
import { setCustomText } from 'react-native-global-props';
import appConfig from './appConfig';
import configureStore from './configureStore';

setCustomText({
    style: {
        fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : 'sans-serif-light',
        color: 'black'
    }
});

const { store, persistor } = configureStore();

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate
                    loading={<ActivityIndicator></ActivityIndicator>}
                    persistor={persistor}>
                    {appConfig.mode === 'app' ?
                        <LoginBearer>
                            <MainContainer />
                        </LoginBearer>
                        :
                        <AnonymousBearer>
                            <MainContainer />
                        </AnonymousBearer>
                    }

                </PersistGate>
            </Provider>
        );
    }
}
