import {Image, TouchableOpacity} from "react-native";
import {Body, Button, Card, CardItem, Icon, Right, Text} from "native-base";
import React from "react";
import styled from "styled-components";

const StyledSongCard = styled(Card)`
    width: 96%;
    height: 230px;
`;

const SongCard = props => {
    const {song} = props;

    return (
        <StyledSongCard key={song.id}>
            <TouchableOpacity onPress={() => props.onPlay(song, props.playlistContext)} style={{width: '100%', flex: 1}}>
                <Image
                    style={{width: '100%', flex: 1}}
                    source={{uri: song.album.images[0].url}}
                />
            </TouchableOpacity>
            <CardItem footer button onPress={() => props.expandSong()}>
                <Body>
                    <Text>{song.name}</Text>
                    <Text note>{song.artists[0].name}</Text>
                </Body>
                <Right>
                    <CardItem style={{paddingLeft: '30%', paddingRight: 0}}>
                        <Body>
                            <Button small rounded bordered={!props.isLiked}
                                    onPress={() => props.likeSong(song)}>
                                <Icon active name="thumbs-up"/>
                            </Button>
                        </Body>
                        <Right>
                            <Button small rounded bordered={!props.isUnliked}
                                    onPress={() => props.unlikeSong(song)}>
                                <Icon active name="thumbs-down"/>
                            </Button>
                        </Right>
                    </CardItem>
                </Right>
            </CardItem>
        </StyledSongCard>
    )
};

export default SongCard;