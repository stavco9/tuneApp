import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Image} from 'react-native';
import {Body, Button, Card, CardItem, Icon, Right, Text, View} from 'native-base';
import axios from 'axios';
import {connect} from "react-redux";
import {LikeSong, UnlikeSong, RemoveLikeSong, RemoveUnlikeSong} from '../redux/actions/like-actions';

const StyledTopSongsContainer = styled(View)`
    display: flex;
    background-color: #9FA8DA;
    flex-flow: row wrap;
    justify-content:space-evenly;
    align-items:center;
`;

const StyledSongCard = styled(Card)`
    width: 96%;
    height: 230px;
`;

const TopSongs = props => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        if (props.isUserLikedTracksLoaded) {
            fetch('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/top/30')
                .then(response => response.json())
                .then(fetchedSongs => {
                    setSongs(fetchedSongs.map(song => {
                        return {
                            ...song,
                            liked: props.likeReducer.likedTracks.includes(song.id),
                            unliked: props.likeReducer.unlikedTracks.includes(song.id)
                        }
                    }));
                });
        }
    }, [props.isUserLikedTracksLoaded]);

    const toggleLikeSong = songId => {
        const updatedSongs = [...songs];
        const songIndex = updatedSongs.findIndex(songItem => {
            return songItem.id === songId
        });
        updatedSongs[songIndex].liked = !updatedSongs[songIndex].liked;
        updatedSongs[songIndex].unliked = false;
        setSongs(updatedSongs);
    };

    const toggleUnlikeSong = songId => {
        const updatedSongs = [...songs];
        const songIndex = updatedSongs.findIndex(songItem => {
            return songItem.id === songId
        });
        updatedSongs[songIndex].unliked = !updatedSongs[songIndex].unliked;
        updatedSongs[songIndex].liked = false;
        setSongs(updatedSongs);
    };

    const likeSong = song => {
        const likeRequest = {trackId: song.id, absolutely: !song.liked};
        const likeUrl = 'http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/'.concat(song.liked ? 'unlike' : 'like');

        axios.post(likeUrl, likeRequest).then(response => {
            if (response) {
                song.liked ? props.removeLikeSong(song.id) : props.likeSong(song.id);
                toggleLikeSong(song.id);
            }
        });
    };

    const unlikeSong = (song) => {
        const likeRequest = {trackId: song.id, absolutely: !song.unliked};
        const likeUrl = 'http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/'.concat(song.unliked ? 'like' : 'unlike');

        axios.post(likeUrl, likeRequest).then(response => {
            if (response) {
                song.unliked ? props.removeLikeSong(song.id) : props.unlikeSong(song.id);
                toggleUnlikeSong(song.id);
            }
        });
    };

    return (
        <StyledTopSongsContainer>
            {
                songs.map(song => {
                        return (
                            <StyledSongCard key={song.id}>
                                <Image source={{uri: song.album.images[0].url}} style={{width: '100%', flex: 1}}/>
                                <CardItem footer>
                                    <Body>
                                        <Text>{song.name}</Text>
                                        <Text note>{song.artists[0].name}.</Text>
                                    </Body>
                                    <Right>
                                        <CardItem style={{paddingLeft: '30%', paddingRight: 0}}>
                                            <Body>
                                                <Button small rounded bordered={!song.liked} onPress={() => likeSong(song)}>
                                                    <Icon active name="thumbs-up"/>
                                                </Button>
                                            </Body>
                                            <Right>
                                                <Button small rounded bordered={!song.unliked}
                                                        onPress={() => unlikeSong(song)}>
                                                    <Icon active name="thumbs-down"/>
                                                </Button>
                                            </Right>
                                        </CardItem>
                                    </Right>
                                </CardItem>
                            </StyledSongCard>
                        )
                    }
                )
            }
        </StyledTopSongsContainer>
    )
};

const mapStateToProps = state => {
    return {
        likeReducer: state.likeReducer
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TopSongs);