import React, {Fragment} from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux'
import {Image, Text, TouchableNativeFeedback, View} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
import {Login} from "../../redux/actions/login-actions";
import {Redirect} from 'react-router-native';
import axios from 'axios';

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

    if (props.user.user === undefined || props.user.user.email === undefined) {
        GoogleSignin.signInSilently().then(user => {
            if (user) {
                console.log(user);

                axios.post('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/users/userexist', {
                    user: {
                        email: user.email
                    }
                }).then(response => {
                   if (response) {
                       props.login(user);
                   }
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }




    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const {user} = await GoogleSignin.signIn();
            if (user) {
                axios.post('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/users/Register', {
                    user: {
                        email: user.email
                    }}).then(response => {
                    console.log(response);
                    axios.post('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/users/userexist', {
                        user: {
                            email: user.email
                        }
                    });
                });
                props.login(user);
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