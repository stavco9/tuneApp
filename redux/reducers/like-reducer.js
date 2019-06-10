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
                state = {
                    ...state,
                    likedTracks: action.likedTracks,
                    unlikedTracks: action.unlikedTracks,
                    likedArtists: action.likedArtists,
                    unlikedArtists: action.unlikedArtists
                };
                break;
            }
            case LIKE: {
                state = {
                    ...state,
                    unlikedTracks: state.unlikedTracks.filter(item => item !== action.songId),
                    likedTracks: [...state.likedTracks, action.songId]
                };
                break;
            }
            case UNLIKE: {
                state = {
                    ...state,
                    likedTracks: state.likedTracks.filter(item => item !== action.songId),
                    unlikedTracks: [...state.unlikedTracks, action.songId]
                };
                break;
            }
            case REMOVE_LIKE: {
                state = {
                    ...state,
                    likedTracks: state.likedTracks.filter(item => item !== action.songId)
                };
                break;
            }
            case REMOVE_UNLIKE: {
                state = {
                    ...state,
                    unlikedTracks: state.unlikedTracks.filter(item => item !== action.songId)
                };
                break;
            }
            default:
                return state;
        }
        return state;
    }
;
