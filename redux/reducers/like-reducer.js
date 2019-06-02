import {LIKE, UNLIKE, REMOVE_LIKE, REMOVE_UNLIKE, SET_INITIAL_STATS} from "../actions/like-actions";

const initState = {
    likedTracks: [],
    likedArtists: [],
    unlikedTracks: [],
    unlikedArtists: []
};

export const likeReducer = (state = initState, action) => {
        switch (action.type) {
            case SET_INITIAL_STATS: {
                state.likedTracks = [...action.likedTracks];
                state.unlikedTracks = [...action.unlikedTracks];
                state.likedArtists = [...action.likedArtists];
                state.unlikedArtists = [...action.unlikedArtists];
                break;
            }
            case LIKE: {
                state.unlikedTracks = state.unlikedTracks.filter(item => item !== action.songId);
                state.likedTracks.push(action.songId);
                break;
            }
            case UNLIKE: {
                state.likedTracks = state.likedTracks.filter(item => item !== action.songId);
                state.unlikedTracks.push(action.songId);
                break;
            }
            case REMOVE_LIKE: {
                state.likedTracks = state.likedTracks.filter(item => item !== action.songId);
                break;
            }
            case REMOVE_UNLIKE: {
                state.unlikedTracks = state.unlikedTracks.filter(item => item !== action.songId);
                break;
            }
            default:
                return state;
        }
        return state;
    }
;
