import React, {Component} from 'react';
import {View, Image, TouchableNativeFeedback, Text} from 'react-native';
import styled from 'styled-components';
import {Link} from "react-router-native";
import LoginIcon from "./LoginIcon";

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

        this.state = {
            lmao: 'nothing'
        }
    }

    render() {
        const onClique = () => {
            this.state.lmao = 'ok';
            return fetch('http://10.0.2.2:8080/tracks/top/15').then(res => {
                this.state.lmao = 'good';
                this.setState({lmao: res});
            }).catch(err => {
                this.setState({lmao: err.toString()});
            })
        };
        return (
            <StyledLoginPage>
                <StyledAppHeader>Welcome to TuneApp</StyledAppHeader>
                <StyledLoginButtonView>
                    <Link to="/about" component={TouchableNativeFeedback}  background={TouchableNativeFeedback.Ripple('ThemeAttrAndroid', true)} activeOpacity={0.8}>
                        <View>
                            <Image style={{width: 50, height: 50}}
                                   source={require('../../assets/sign-in-with-google.png')}/>
                        </View>
                    </Link>
                    <TouchableNativeFeedback onPress={onClique}
                                             background={TouchableNativeFeedback.Ripple('ThemeAttrAndroid', true)}>
                        <Image style={{width: 50, height: 50}}
                               source={require('../../assets/sign-in-with-spotify.png')}/>
                    </TouchableNativeFeedback>
                </StyledLoginButtonView>
                <Text>{JSON.stringify(this.state.lmao)}</Text>
            </StyledLoginPage>
        );
    }
}

export default LoginPage