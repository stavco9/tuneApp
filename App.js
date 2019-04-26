import React, {Component} from 'react';
import {Provider} from 'react-redux'
import {NativeRouter, Route} from "react-router-native";
import store from "./redux/store";
import LoginPage from "./Components/LoginPage/LoginPage";
import {View} from 'react-native';


const Props = {};

export default class App extends Component<Props> {
    render() {
        return (
            <NativeRouter>
                <Provider store={store}>
                    <Route exact path="/" component={LoginPage} />
                    <Route exact path="/top" component={View} />
                </Provider>
            </NativeRouter>
        );
    }
}