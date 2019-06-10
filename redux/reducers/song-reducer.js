import {
    SET_TOP_SONGS,
    SET_SEARCHED_SONGS,
    TOGGLE_LIKE_SONG,
    TOGGLE_UNLIKE_SONG,
    SET_USER_PLAYLIST
} from "../actions/songs-actions";

const initState = {
    topSongs: [],
    searchedSongs: [],
    userPlaylist: []
};

export const songReducer = (state = initState, action) => {
        const getSongByIdFromTop = songId => {
            return state.topSongs.findIndex(songItem => {
                return songItem.id === songId
            });
        };

        const getSongByIdFromSearched = songId => {
            return state.searchedSongs.findIndex(songItem => {
                return songItem.id === songId
            });
        };

        switch (action.type) {
            case SET_TOP_SONGS: {
                state = {
                    ...state,
                    topSongs: action.topSongs
                };
                break;
            }

            case SET_SEARCHED_SONGS: {
                state = {
                    ...state,
                    searchedSongs: action.searchedSongs
                };
                break;
            }

            case TOGGLE_LIKE_SONG: {
                const topSongIndex = getSongByIdFromTop(action.songId);
                const searchedSongIndex = getSongByIdFromSearched(action.songId);
                const updatedTopSongs = [...state.topSongs];
                const updatedSearchedSongs = [...state.searchedSongs];

                if (topSongIndex !== -1) {
                    updatedTopSongs[topSongIndex].liked = !state.topSongs[topSongIndex].liked;
                    updatedTopSongs[topSongIndex].unliked = false;
                }

                if (searchedSongIndex !== -1) {
                    updatedSearchedSongs[searchedSongIndex].liked = !state.searchedSongs[searchedSongIndex].liked;
                    updatedSearchedSongs[searchedSongIndex].unliked = false;
                }

                state = {
                    ...state,
                    topSongs: updatedTopSongs,
                    searchedSongs: updatedSearchedSongs
                };
                break;
            }
            case TOGGLE_UNLIKE_SONG: {
                const topSongIndex = getSongByIdFromTop(action.songId);
                const searchedSongIndex = getSongByIdFromSearched(action.songId);
                const updatedTopSongs = [...state.topSongs];
                const updatedSearchedSongs = [...state.searchedSongs];

                if (topSongIndex !== -1) {
                    updatedTopSongs[topSongIndex].unliked = !state.topSongs[topSongIndex].unliked;
                    updatedTopSongs[topSongIndex].liked = false;
                }

                if (searchedSongIndex !== -1) {
                    updatedSearchedSongs[searchedSongIndex].unliked = !state.searchedSongs[searchedSongIndex].unliked;
                    updatedSearchedSongs[searchedSongIndex].liked = false;
                }

                state = {
                    ...state,
                    topSongs: updatedTopSongs,
                    searchedSongs: updatedSearchedSongs
                };
                break;
            }
            case SET_USER_PLAYLIST:
                state = {
                    ...state,
                    userPlaylist: action.userPlaylist
                };
                break;
            default:
                return state;
        }
        return state;
    }
;
