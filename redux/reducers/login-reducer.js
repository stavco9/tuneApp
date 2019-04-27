import {LOGIN} from "../actions/login-actions";

const initState = {
    googleId: '',
    email: '',
    name: '',
};

export const loginReducer = (state = initState, action) => {
        switch (action.type) {
            case LOGIN: {
                fetch('localhost:8080/home').then(res => {
                    console.log(res);
                });
                break;
            }
            default:
                return state;
        }
        console.log(state);
        return state;
    }
;
