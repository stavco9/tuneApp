import {ListItem, Thumbnail, Left, Right, Body, Text, Button, Icon} from "native-base";
import React from "react";

const CompactSong = props => {
    const {song} = props;

    return (
        <ListItem thumbnail button onPress={() => props.expandSong()}>
            <Left>
                <Thumbnail square source={{ uri: song.album.images[0].url }} />
            </Left>
            <Body>
                <Text>{song.name}</Text>
                <Text note numberOfLines={1}>{song.artists[0].name}</Text>
            </Body>
            <Right>
                <Button small rounded onPress={() => props.onPlay(song, props.playlistContext)}>
                    <Icon active name="play"/>
                </Button>
            </Right>
        </ListItem>
    );
};

export default CompactSong;