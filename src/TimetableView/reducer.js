import { REHYDRATE } from 'redux-persist';

export default function(state = {masterdata: {version: 0}}, action){
    switch(action.type){
        case REHYDRATE:
            return action.payload && action.payload.timetable || state;
        case "SET_MASTERDATA":
            return {...state, masterdata: action.payload}
    }
    
    return {...state};
};