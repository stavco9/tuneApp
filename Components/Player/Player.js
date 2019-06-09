import React, {Fragment, useEffect, useState} from 'react';
import {Image, StyleSheet} from 'react-native';
import {Text, View} from 'native-base';
import ProgressBar from './ProgressBar';
import TrackPlayer, {STATE_PAUSED, STATE_PLAYING} from 'react-native-track-player';
import TouchableIcon from "./TouchableIcon";
import {connect} from "react-redux";


const Player = props => {
    const {requestedSong, currentPlaylist, newTrackId} = props.player;
    const [selectedTrack, setSelectedTrack] = useState();

    const _checkChangeSelectedTrack = async () => {
        let isCurrentTrack;
        isCurrentTrack = TrackPlayer.getCurrentTrack().then(trackId => {
            if (currentPlaylist && (trackId !== currentPlaylist[0].id)) {
                _playNewTrack();
            }
        }).catch(() => {
            // If nothing is playing, it rejects the promise
            isCurrentTrack = false;
        });
    };

    const getTrackStructure = tracks => {
        let structuredTracks = [];
        tracks.map(track => {
            if (track.preview_url) {
                structuredTracks = structuredTracks.concat({
                    id: track.id,
                    url: track.preview_url,
                    title: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    artwork: track.album.images[0].url,
                })
            }
        });
        return structuredTracks;
    };

    const _onPlayPause = async () => {
        const state = props.player.playerState;

        if (state === STATE_PLAYING) {
            await TrackPlayer.pause();
        } else if (state === STATE_PAUSED) {
            const position = Math.round(await TrackPlayer.getPosition());
            const duration = Math.round(await TrackPlayer.getDuration());
            if (position === duration) {
                // It's finished
                _playNewTrack();
            } else {
                await TrackPlayer.play();
            }
        } else {
            _playNewTrack();
        }
    };

    const _playNewTrack = async () => {
        await TrackPlayer.reset();
        await TrackPlayer.add(getTrackStructure(currentPlaylist));
        await TrackPlayer.play();
    };

    useEffect(() => {
        if (requestedSong) {
            _checkChangeSelectedTrack();
            setSelectedTrack(requestedSong)
        }
    }, [requestedSong, currentPlaylist]);


    useEffect(() => {

        if (currentPlaylist) {
            const newTrack = currentPlaylist.find(track => track.id === props.player.newTrackId);

            if (newTrack) {
                setSelectedTrack(newTrack);
            }
        }
    }, [newTrackId]);

    return (
        <Fragment>
            {selectedTrack && (
                <View style={styles.container}>
                    <View style={styles.trackContainer}>
                        <Fragment>
                            <Image
                                source={{
                                    uri: selectedTrack.album.images[0].url,
                                }}
                                style={styles.albumCover}
                            />
                            <View style={styles.trackInfo}>
                                <View>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.title]}
                                    >
                                        {selectedTrack.name}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                        style={[
                                            styles.artist,
                                        ]}
                                    >
                                        {selectedTrack.artists[0].name.toUpperCase()}
                                    </Text>
                                </View>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <ProgressBar/>
                                    <TouchableIcon
                                        name="md-rewind"
                                        style={styles.iconButton}
                                        onPress={() => {
                                            TrackPlayer.skipToPrevious()
                                        }}
                                    />
                                    <TouchableIcon
                                        name={props.player.playerState === STATE_PLAYING ? 'md-pause' : 'md-play'}
                                        style={styles.iconButton}
                                        onPress={_onPlayPause}
                                    />
                                    <TouchableIcon
                                        name="md-fastforward"
                                        style={styles.iconButton}
                                        onPress={() => {
                                            TrackPlayer.skipToNext()
                                        }}
                                    />
                                </View>
                            </View>
                        </Fragment>
                    </View>
                </View>
            )}
        </Fragment>
    );

};

const styles = StyleSheet.create({
    container: {
        height: 110,
    },
    trackContainer: {
        height: 90,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    albumCover: {
        height: 80,
        width: 80,
    },
    trackInfo: {
        flex: 1,
        height: 100,
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingVertical: 4,
    },
    title: {
        fontSize: 20,
        paddingBottom: 2,
    },
    artist: {
        fontSize: 14,
        paddingTop: 2,
        paddingBottom: 10,
    },
    trackPlaceHolder: {
        flex: 1,
        alignItems: 'center',
    },
    placeHolderText: {
        fontSize: 18,
    },
    playerContainer: {
        flexDirection: 'row',
        height: 80,
    },
    iconButton: {
        flex: 1,
        alignItems: 'center',
    },
});

export default connect(state => ({player: state.playerReducer}), null)(Player);