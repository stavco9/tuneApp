import React, {Component} from "react";
import styled from "styled-components";
import {Content} from 'native-base';
import TopSongs from "../../TopSongs";
import {Route} from "react-router-native";

const StyledContent = styled(Content)`
    display: flex;
    background-color: red;
`;

export default class AppContent extends Component<Props> {
    render() {
        return (
            <StyledContent>
                <Route exact path={"/home/topSongs"} component={TopSongs}/>
            </StyledContent>
        );
    }
}