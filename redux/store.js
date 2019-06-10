import {combineReducers, createStore} from "redux";
import {loginReducer} from "./reducers/login-reducer";
import {likeReducer} from "./reducers/like-reducer";
import playerReducer from "./reducers/player-reducer";
import {songReducer} from "./reducers/song-reducer";

const store = createStore(combineReducers({login: loginReducer, likeReducer, songReducer, playerReducer}));

export default store;