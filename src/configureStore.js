
import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

import { composeWithDevTools } from 'redux-devtools-extension';
import dataService from './common/data-service';
import authReducer from './Login/reducer';
import masterdataReducer from './TimetableView/reducer';
const config = {
    key: 'root',
    storage,
    debug: true,
    version: 1,
}

const reducer = persistCombineReducers(config, {
    auth: authReducer,
    masterdata: masterdataReducer,
});

export default () => {
    let store = createStore(reducer, composeWithDevTools(applyMiddleware(dataService)));
    let persistor = persistStore(store);
    return { store, persistor }
}