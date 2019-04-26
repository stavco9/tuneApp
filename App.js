import React, {Component} from 'react';
import {Provider} from 'react-redux'
import store from "./redux/store";
import LoginPage from "./Components/LoginPage/LoginPage";
import Shell from "./Components/Shell/Shell";
import {Router, Scene, Stack} from "react-native-router-flux";


const Props = {};

export default class App extends Component<Props> {
    render() {
        return (
            <Router>
                <Provider store={store}>
                    <Stack key="root" hideNavBar={true}>
                        <Scene key="/" component={LoginPage}/>
                        <Scene key="top" component={Shell}/>
                    </Stack>
                </Provider>
            </Router>
        );
    }
}