import React, {Component} from "react";
import {Text} from "react-native";
import {Container, Header, Left, Button, Icon, Title, Body, Right} from 'native-base';

export default class AppHeader extends Component<Props> {
    render() {
        return (
            <Header>
                <Left>
                    <Button transparent onPress={() => console.log("HARA")}>
                        <Icon name='arrow-back'/>
                    </Button>
                </Left>
                <Body>
                <Title>Tune App</Title>
                </Body>
                <Right>
                    <Button transparent>
                        <Text>Cancel</Text>
                    </Button>
                </Right>
            </Header>
        );
    }
}