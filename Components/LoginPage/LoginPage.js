import React, {Fragment} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux'
import {Image, Text, TouchableNativeFeedback, View} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
import {Login} from "../../redux/actions/login-actions";
import {Redirect} from 'react-router-native';

GoogleSignin.configure({
    webClientId: "331158363292-hd64i4i48r4oaij2op4l5nahpf6u0rfo.apps.googleusercontent.com",
    offlineAccess: true
});


const StyledLoginPage = styled(View)`
    display: flex;
    justify-content: space-evenly;
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
    width: 100%;
    font-size: 26px;
    color: white;
    text-align: center;
    font-family: "Roboto-Thin";
    text-align: center;
`;

const LoginPage = props => {
    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const {user} = await GoogleSignin.signIn();
            if (user) {
                props.login(user);
                console.log(user);
            }
        } catch (error) {
        }
    };
    return (
        <Fragment>
            {props.user.email ? <Redirect to="/home/topSongs"/> :
                (
                    < StyledLoginPage>
                        < StyledAppHeader> Welcome to TuneApp!!!</StyledAppHeader>
                        <StyledLoginButtonView>
                            <TouchableNativeFeedback onPress={signIn}
                                                     background={TouchableNativeFeedback.Ripple('ThemeAttrAndroid', true)}>
                                <View>
                                    <Image style={{width: 50, height: 50}}
                                           source={require('../../assets/sign-in-with-google.png')}/>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={signIn}
                                                     background={TouchableNativeFeedback.Ripple('ThemeAttrAndroid', true)}>
                                <Image style={{width: 50, height: 50}}
                                       source={require('../../assets/sign-in-with-spotify.png')}/>
                            </TouchableNativeFeedback>
                        </StyledLoginButtonView>
                    </StyledLoginPage>
                )
            }
        </Fragment>
    )
        ;
};

const mapStateToProps = state => {
    return {
        user: state.login
    }
};

const mapDispatchToProps = dispatch => {
    return {
        login: user => {
            dispatch(Login(user));
        },
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);