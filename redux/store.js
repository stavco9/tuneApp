import {combineReducers, createStore} from "redux";
import {loginReducer} from "./reducers/login-reducer";
import {likeReducer} from "./reducers/like-reducer";

const store = createStore(combineReducers({login: loginReducer, likeReducer}));

export default store;