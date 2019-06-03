import React, {Component} from "react";
import {Text} from "react-native";
import {Body, Button, Header, Icon, Left, Right, Title} from 'native-base';

export default class AppHeader extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Header>
                <Left>
                    <Button transparent onPress={() => this.props.drawer()}>
                        <Icon name='menu'/>
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