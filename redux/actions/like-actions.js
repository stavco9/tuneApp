export const LIKE = 'LIKE';
export const UNLIKE = 'UNLIKE';
export const REMOVE_LIKE = 'REMOVE_LIKE';
export const REMOVE_UNLIKE = 'REMOVE_UNLIKE';
export const SET_INITIAL_STATS = "SET_INITIAL_STATS";

export const LikeSong = songId =>  {
    return { type: LIKE, songId}
};

export const UnlikeSong = songId =>  {
    return { type: UNLIKE, songId}
};

export const RemoveLikeSong = songId =>  {
    return { type: REMOVE_LIKE, songId}
};

export const RemoveUnlikeSong = songId =>  {
    return { type: REMOVE_UNLIKE, songId}
};

export const SetInitialStats = ({likedTracks, likedArtists, unlikedTracks, unlikedArtists}) =>  {
    return { type: SET_INITIAL_STATS, likedTracks, likedArtists, unlikedArtists, unlikedTracks}
};