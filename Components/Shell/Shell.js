import React, {Component} from "react";
import styled from "styled-components";
import {Container} from 'native-base';
import AppHeader from "./AppHeader/AppHeader";

const StyledShellPage = styled(Container)`
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #3F51B5;
`;

export default class App extends Component<Props> {
    render() {
        return (
            <StyledShellPage>
                <AppHeader/>
            </StyledShellPage>
        );
    }
}