import {combineReducers, createStore} from "redux";
import {loginReducer} from "./reducers/login-reducer";
import playerReducer from "./reducers/player-reducer";

const store = createStore(combineReducers({login: loginReducer, playerReducer}));

export default store;