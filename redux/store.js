import {combineReducers, createStore} from "redux";
import {loginReducer} from "./reducers/login-reducer";

const store = createStore(combineReducers({login: loginReducer}));

export default store;