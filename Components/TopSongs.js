import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Image} from 'react-native';
import {Body, Button, Card, CardItem, Icon, Right, Text, View} from 'native-base';
import axios from 'axios';
import {connect} from "react-redux";
import {Login} from "../redux/actions/login-actions";

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

const mapStateToProps = state => {
    return {
        user: state.login
    }
};

const mapDispatchToProps = dispatch => {
    return {
        login: user => {
            dispatch(Login(user));
        },
    }
};

const TopSongs = props => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        fetch('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/top/3')
        //fetch('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/similar/1GLmaPfulP0BrfijohQpN5')
            .then(response => response.json())
            .then(data => {
                setSongs(data);
            });

    }, []);

    const likeSong = (song) => {
        const likeRequest = { trackId: song.id, absolutely: !props.user.likedTracks.includes(song.id) };
        axios.post('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/like', likeRequest).then(response => {
            if (response) {
                if (likeRequest.absolutely) {
                    props.user.likedTracks.push(song.id);
                }
                else {
                    props.user.likedTracks = props.user.likedTracks.filter(item => item !== song.id);
                }
                props.login(props.user);
            }
        });
    };

    const unlikeSong = (song) => {
        const unlikeRequest = { trackId: song.id, absolutely: !props.user.unlikedTracks.includes(song.id) };
        axios.post('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/unlike', unlikeRequest).then(response => {
            if (response) {
                if (unlikeRequest.absolutely) {
                    props.user.unlikedTracks.push(song.id);
                }
                else {
                    props.user.unlikedTracks = props.user.unlikedTracks.filter(item => item !== song.id);
                }
                props.login(props.user);
            }
        });
    };

    return (
        <StyledTopSongsContainer>
            {
                songs.map(song => {
                    const isLiked = props.user.likedTracks.includes(song.id);
                    const isUnliked = props.user.unlikedTracks.includes(song.id);

                        return (
                            <StyledSongCard key={song.id}>
                                <Image source={{uri: song.album.images[0].url}} style={{width: '100%', flex: 1}}/>
                                <CardItem footer>
                                    <Body>
                                        <Text>{song.name}</Text>
                                        <Text note>{song.artists[0].name}.</Text>
                                    </Body>
                                    <Right>
                                        <Button rounded transparent={isLiked} onPress={() => likeSong(song)}>
                                            <Icon active name="thumbs-up"/>
                                        </Button>
                                        <Button rounded transparent={isUnliked} onPress={() => unlikeSong(song)}>
                                            <Icon active name="thumbs-down"/>
                                        </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(TopSongs);