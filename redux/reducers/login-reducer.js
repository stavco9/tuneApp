import {LOGIN} from "../actions/login-actions";

const initState = {
};

export const loginReducer = (state = initState, action) => {
        switch (action.type) {
            case LOGIN: {
                state = action.user;
                break;
            }
            default:
                return state;
        }
        return state;
    }
;
