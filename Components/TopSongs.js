import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {View, Card, CardItem, Left, Body, Icon, Right, Button, Thumbnail, Text, Content} from 'native-base';

const StyledTopSongsContainer = styled(View)`
    display: flex;
    flex-flow: row wrap;
`;

const StyledSongCard = styled(Card)`
    width: 70px;
    height: 100px;
`;

const TopSongs = props => {
    const [songs, setSogns] = useState([]);
    useEffect(() => {

        fetch('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/top/15').then(res => {
            console.log(res);
            setSogns(res);
        });

    }, []);

    return (
        <StyledTopSongsContainer>
            <Card>
                <CardItem>
                    <Left>
                        <Thumbnail
                            source={{uri: ''}}/>
                        <Content>
                            <Text>NativeBase</Text>
                            <Text note>GeekyAnts</Text>
                        </Content>
                    </Left>
                </CardItem>
                <CardItem>
                    <Left>
                        <Button transparent>
                            <Icon active name="thumbs-up"/>
                            <Text>12 Likes</Text>
                        </Button>
                    </Left>
                    <Body>
                        <Button transparent>
                            <Icon active name="chatbubbles"/>
                            <Text>4 Comments</Text>
                        </Button>
                    </Body>
                    <Right>
                        <Text>11h ago</Text>
                    </Right>
                </CardItem>
            </Card>
        </StyledTopSongsContainer>
    )
};

export default TopSongs;