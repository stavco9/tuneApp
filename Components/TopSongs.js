import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Image} from 'react-native';
import {Body, Button, Card, CardItem, Icon, Right, Text, View} from 'native-base';

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

        fetch('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/top/20')
        //fetch('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/similar/1GLmaPfulP0BrfijohQpN5')
            .then(response => response.json())
            .then(data => {
                setSongs(data);
            });

    }, []);

    return (
        <StyledTopSongsContainer>
            {
                songs.map(song =>
                    (
                        <StyledSongCard key={song.id}>
                            <Image source={{uri: song.album.images[0].url}} style={{width: '100%', flex: 1}}/>
                            <CardItem footer>
                                <Body>
                                    <Text>{song.name}</Text>
                                    <Text note>{song.artists[0].name}.</Text>
                                </Body>
                                <Right>
                                    <Button transparent>
                                        <Icon active name="thumbs-up"/>
                                        <Text>{song.popularity} Likes</Text>
                                    </Button>
                                </Right>
                            </CardItem>
                        </StyledSongCard>
                    )
                )
            }
        </StyledTopSongsContainer>
    )
};

export default TopSongs;