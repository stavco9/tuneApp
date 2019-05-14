import React, {Component} from 'react';
import {Provider} from 'react-redux'
import store from "./redux/store";
import LoginPage from "./Components/LoginPage/LoginPage";
import Shell from "./Components/Shell/Shell";
import {NativeRouter, Route, BackButton} from "react-router-native";

export default class App extends Component<Props> {
    render() {
        return (
            <NativeRouter>
                <BackButton>
                    <Provider store={store}>
                        <Route exact path="/" component={LoginPage}/>
                        <Route path="/home" component={Shell}/>
                    </Provider>
                </BackButton>
            </NativeRouter>
        );
    }
}