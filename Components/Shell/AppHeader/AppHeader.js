import React, {Component} from "react";
import {Text} from "react-native";
import {Header, Left, Button, Icon, Title, Body, Right} from 'native-base';

const openDrawer = () => {
    Props.drawer._root.close()
};

export default class AppHeader extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Header>
                <Left>
                    <Button transparent onPress={()=>this.props.drawer()}>
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