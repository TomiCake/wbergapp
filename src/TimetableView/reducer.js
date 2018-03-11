import { REHYDRATE } from 'redux-persist';

export default function(state = {masterdata: {version: 0}}, action){
    switch(action.type){
        case REHYDRATE:
            return action.payload && action.payload.timetable || state;
        case "GET_MASTERDATA_ALL_RECEIVED":
            return { ...state, masterdata: action.payload };
        case "GET_MASTERDATA_ALL_ERROR":
            return { ...state, error: action.payload };
        case "GET_MASTERDATA_VERSION_RECEIVED":
            return { ...state, masterdata: { ...state.masterdata, versionChanged: state.masterdata.version !== action.payload.version } };
        case "GET_MASTERDATA_VERSION_ERROR":
            return { ...state, error: action.payload };    
    }
    
    return {...state};
};