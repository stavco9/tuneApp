import React, {Component} from "react";
import styled from "styled-components";
import {Container} from 'native-base';
import AppHeader from "./AppHeader/AppHeader";
import AppContent from "./AppContent/AppContent";

const StyledShellPage = styled(Container)`
    display: flex;
    width: 100%;
    height: 100%;
`;

export default class Shell extends Component<Props> {
    render() {
        return (
            <StyledShellPage>
                <AppHeader/>
                <AppContent/>
            </StyledShellPage>
        );
    }
}