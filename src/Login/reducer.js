const initialState = {
    loading: false,
    token: null,
    id: null,
    username: '',
    error: null
};

export default function loginReducer(state = initialState, action = {}) {
    switch (action.type) {
        case "persist/REHYDRATE":
            return action.payload ? {
                ...state,
                username: action.payload.auth.username,
                id: action.payload.auth.id,
                token: action.payload.auth.token
            } : state;
        case "SET_TOKEN": 
            return {
                ...state,
                token: action.payload,
            }
        case "GET_TOKEN":
            return {
                ...state,
                username: action.payload.email,
                loading: true
            };
        case "GET_TOKEN_RECEIVED":
            return {
                ...state,
                loading: false,
                token: action.payload.token,
                id: action.payload.id,
                error: null
            };
        case "GET_TOKEN_ERROR":
            return {
                ...state,
                loading: false,
                token: null,
                error: action.payload
            };
        default:
            return state;
    }
}