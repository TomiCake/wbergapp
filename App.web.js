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

const setCustomText = customProps => {
    const TextRender = Text.prototype.render;
    const initialDefaultProps = Text.prototype.constructor.defaultProps;
    Text.prototype.constructor.defaultProps = {
        ...initialDefaultProps,
        ...customProps,
    }
    Text.prototype.render = function render() {
        let oldProps = this.props;
        this.props = { ...this.props, style: [customProps.style, this.props.style] };
        try {
            return TextRender.apply(this, arguments);
        } finally {
            this.props = oldProps;
        }
    };
};


const fontAwesome = require('react-native-vector-icons/Fonts/MaterialIcons.ttf');
// Web Mode only - generate required css
const reactNativeVectorIconsRequiredStyles = '@font-face { src:url(' + fontAwesome + '); font-family: Material Icons; }';
// create stylesheet
const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
    style.styleSheet.cssText = reactNativeVectorIconsRequiredStyles;
} else {
    style.appendChild(document.createTextNode(reactNativeVectorIconsRequiredStyles));
}
// inject stylesheet
document.head.appendChild(style);

const config = {
    key: 'root',
    storage,
    debug: true,
    version: 1,
};

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
