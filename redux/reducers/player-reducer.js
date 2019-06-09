import {CHANGE_CURRENT_TRACK, PLAY_SONGS} from "../actions/player-actions";

export const PLAYBACK_STATE = 'PLAYBACK_STATE';

const initialState = {
    playerState: null,
    newTrackId: undefined
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case PLAYBACK_STATE: {
            state = {...state, ...{playerState: action.payload}};
            break;
        }
        case CHANGE_CURRENT_TRACK : {
            state = {
                ...state,
                newTrackId: action.newTrackId
            };
            break;
        }
        case PLAY_SONGS : {
            state = {
                ...state,
                currentPlaylist: action.songsList,
                requestedSong: action.requestedSong
            };
            break;
        }
        default:
            return state;
    }

    return state;
}

export const playbackState = (payload: string) => ({
    type: PLAYBACK_STATE,
    payload,
});
