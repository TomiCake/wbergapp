
export default function(state = {masterdata: {version: 0}}, action){
    switch(action.type){
        case "persist/REHYDRATE":
            if(action.payload && action.payload.timetable)
                return {...state, ...action.payload.timetable}
        case "SET_MASTERDATA":
            return {...state, masterdata: action.payload}
    }
    
    return {...state};
};