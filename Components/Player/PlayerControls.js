import React, {PureComponent} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {connect} from 'react-redux';

import TouchableIcon from './TouchableIcon';
//import { getTrackStructure } from './Utils';
import playerReducer from "../../redux/reducers/player-reducer";

const STATE_PLAYING = Platform.OS === 'android' ? 3 : 'STATE_PLAYING';
const STATE_PAUSED = Platform.OS === 'android' ? 2 : 'STATE_PAUSED';

class PlayerControls extends PureComponent<Props> {

    render() {
        const {playerState, track} = this.props;

        return (
            <View
                style={[
                    styles.playerContainer,
                    {backgroundColor: "white", justifyContent: 'space-around'},
                ]}
            >


            </View>
        );
    }
}

