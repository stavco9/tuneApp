import React, {Component} from "react";
import {Text} from "react-native";
import {Container, Header, Left, Button, Icon, Title, Body, Right} from 'native-base';
import {Actions} from "react-native-router-flux";

export default class AppHeader extends Component<Props> {
    render() {
        return (
                <Container>
                    <Header>
                        <Left>
                            <Button transparent onPress={() => Actions.pop()}>
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
                </Container>
        );
    }
}