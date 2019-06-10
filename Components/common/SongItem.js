import React, {Fragment, useState} from "react";
import {connect} from "react-redux";
import {LikeSong, RemoveLikeSong, RemoveUnlikeSong, UnlikeSong} from "../../redux/actions/like-actions";
import {ToggleLikeSong, ToggleUnlikeSong} from "../../redux/actions/songs-actions";
import axios from "axios";
import {Redirect} from 'react-router-native'
import {playSongs} from "../../redux/actions/player-actions";

const SongItem = (SongComponent, song, playlistContext = [song]) => {
    const songItemComponent = props => {
        const [isExpanded, setIsExpanded] = useState(false);

        const expandSongCard = () => {
            setIsExpanded(true);
        };

        const likeSong = song => {
            const likeRequest = {trackId: song.id, absolutely: !song.liked};
            const likeUrl = 'http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/'.concat(song.liked ? 'unlike' : 'like');

            axios.post(likeUrl, likeRequest).then(response => {
                if (response) {
                    song.liked ? props.removeLikeSong(song.id) : props.likeSong(song.id);
                    props.toggleLikeSong(song.id);
                }
            });
        };

        const unlikeSong = song => {
            const likeRequest = {trackId: song.id, absolutely: !song.unliked};
            const likeUrl = 'http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/'.concat(song.unliked ? 'like' : 'unlike');

            axios.post(likeUrl, likeRequest).then(response => {
                if (response) {
                    song.unliked ? props.removeUnlikeSong(song.id) : props.unlikeSong(song.id);
                    props.toggleUnlikeSong(song.id);
                }
            });
        };

        return (
            <Fragment>
                {isExpanded && <Redirect to={{
                    pathname: '/home/selectedSong',
                    state: {song: song}
                }}/>}
                <SongComponent song={song}
                               isLiked={props.likeReducer.likedTracks.includes(song.id)}
                               isUnliked={props.likeReducer.unlikedTracks.includes(song.id)}
                               likeSong={likeSong}
                               unlikeSong={unlikeSong}
                               expandSong={expandSongCard}
                               playlistContext={playlistContext}
                               onPlay={props.playSongs}
                />
            </Fragment>
        );
    };

    const mapStateToProps = state => {
        return {
            likeReducer: state.likeReducer,
            songReducer: state.songReducer,
            player: state.playerReducer
        }
    };

    const mapDispatchToProps = dispatch => {
        return {
            likeSong: songId => {
                dispatch(LikeSong(songId));
            },
            unlikeSong: songId => {
                dispatch(UnlikeSong(songId));
            },
            removeLikeSong: songId => {
                dispatch(RemoveLikeSong(songId));
            },
            removeUnlikeSong: songId => {
                dispatch(RemoveUnlikeSong(songId));
            },
            toggleLikeSong: topSongs => {
                dispatch(ToggleLikeSong(topSongs));
            },
            toggleUnlikeSong: topSongs => {
                dispatch(ToggleUnlikeSong(topSongs));
            },
            playSongs: (clickedSong, songsList) => {
                dispatch(playSongs(songsList.slice(songsList.indexOf(clickedSong)), clickedSong));
            }
        }
    };

    return connect(mapStateToProps, mapDispatchToProps)(songItemComponent);
};

export default SongItem;