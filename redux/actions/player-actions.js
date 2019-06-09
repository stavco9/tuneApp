export const CHANGE_CURRENT_TRACK = 'CHANGE_CURRENT_TRACK';
export const PLAY_SONGS = 'PLAY_SONGS';

export const changeCurrentTrack = currentTrackId =>  {
    return { type: CHANGE_CURRENT_TRACK, newTrackId: currentTrackId}
};

export const playSongs = (songsList, requestedSong) => {
    return { type: PLAY_SONGS, songsList, requestedSong}
};