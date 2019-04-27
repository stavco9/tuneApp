import React, {Component} from 'react';
import {View, Image, TouchableNativeFeedback, Text} from 'react-native';
import {Actions} from "react-native-router-flux";
import styled from 'styled-components';

const StyledLoginPage = styled(View)`
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-flow: column;
    width: 100%;
    height: 100%;
    background-color: #3F51B5;
`;

const StyledLoginButtonView = styled(View)`
    display: flex;
    width: 200px;
    justify-content: space-evenly;
    align-items: center;
    flex-flow: row;
`;

const StyledAppHeader = styled(Text)`
    font-size: 20px;
    color: white;
    font-family: "Roboto-Thin";
`;

class LoginPage extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StyledLoginPage>
                <StyledAppHeader>Welcome to TuneApp</StyledAppHeader>
                <StyledLoginButtonView>
                    <TouchableNativeFeedback onPress={() => Actions.top()}
                                             background={TouchableNativeFeedback.Ripple('ThemeAttrAndroid', true)}>
                        <View>
                            <Image style={{width: 50, height: 50}}
                                   source={require('../../assets/sign-in-with-google.png')}/>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('ThemeAttrAndroid', true)}>
                        <Image style={{width: 50, height: 50}}
                               source={require('../../assets/sign-in-with-spotify.png')}/>
                    </TouchableNativeFeedback>
                </StyledLoginButtonView>
            </StyledLoginPage>
        );
    }
}

export default LoginPage