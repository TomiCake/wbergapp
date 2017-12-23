
export default function (state, action) {
    switch (action.type) {
        case "persist/REHYDRATE":
            if (action.payload && action.payload.auth)
                return { ...state, ...action.payload.auth }
        case "SET_TOKEN":
            return { ...state, token: action.payload };
        case "SET_ID":
            return { ...state, id: action.payload };
        case "SET_LAST_USERNAME":
            return { ...state, lastUsername: action.username };
    }

    return { ...state };
};