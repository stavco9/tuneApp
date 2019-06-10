import SongCard from "./SongCardList/SongCard";
import React, {useEffect, useState} from "react";
import {View, Text, List, ListItem, Spinner} from 'native-base'
import axios from "axios";
import CompactSong from "./CompactSongList/CompactSong";
import styled from "styled-components";
import SongItem from "./common/SongItem";
import {Image, ScrollView} from "react-native";

const StyledSongContainer = styled(View)`
    display: flex;
    flex-flow: column;
    flex: 1;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
    background-color: #ECEFF1;
`;

const ExpandedSongCard = props => {
    const [similarSongs, setSimilarSongs] = useState([]);
    const song = props.song ? props.song : props.location.state.song;

    useEffect(() => {
        setSimilarSongs([]);
        axios.get('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/similar/'.concat(song.id))
            .then(({data: similarSongs}) => {
                setSimilarSongs([...similarSongs]);
            });
    }, [song]);

    const SongCardItem = SongItem(SongCard, song);
    return (
        <View>
            <StyledSongContainer>
                <Image
                    style={{width: '100%', height: 250, flex: 1}}
                    source={{uri: song.album.images[0].url}}
                />
                <ListItem style={{width: '100%'}} itemDivider>
                    <Text>{song.artists[0].name} - {song.name}</Text>
                </ListItem>
            </StyledSongContainer>
            <ScrollView style={{height: 378, backgroundColor: 'white', display: 'flex'}}>
                {!similarSongs.length ? <Spinner color={'#3c50b5'}/> :
                    similarSongs.map(similarSong => {
                        const SongCardItem = SongItem(CompactSong, similarSong, similarSongs);
                        return <SongCardItem/>
                    })
                }
            </ScrollView>
        </View>
    )
};

export default ExpandedSongCard;