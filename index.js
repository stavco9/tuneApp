import {AppRegistry} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import playerHandler from './Components/Player/PlayerHandler.js';
import App from './App';
import {name as appName} from './app.json';
import store from './redux/store'

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerEventHandler(playerHandler(store.dispatch));