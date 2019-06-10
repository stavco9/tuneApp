export const SET_TOP_SONGS = 'SET_TOP_SONGS';
export const SET_SEARCHED_SONGS = 'SET_SEARCHED_SONGS';
export const TOGGLE_LIKE_SONG = 'TOGGLE_LIKE_SONG';
export const TOGGLE_UNLIKE_SONG = 'TOGGLE_UNLIKE_SONG';
export const SET_USER_PLAYLIST = 'SET_USER_PLAYLIST';

export const SetTopSongs = topSongs =>  {
    return { type: SET_TOP_SONGS, topSongs}
};

export const ToggleLikeSong = songId =>  {
    return { type: TOGGLE_LIKE_SONG, songId}
};

export const ToggleUnlikeSong = songId =>  {
    return { type: TOGGLE_UNLIKE_SONG, songId}
};

export const SetSearchedSongs = searchedSongs =>  {
    return { type: SET_SEARCHED_SONGS, searchedSongs}
};

export const SetUserPlaylist = userPlaylist => {
    return {type: SET_USER_PLAYLIST, userPlaylist}
};
