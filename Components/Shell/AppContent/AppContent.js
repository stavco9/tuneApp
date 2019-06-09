import React, {Component} from "react";
import styled from "styled-components";
import {Content} from 'native-base';
import TopSongs from "../../TopSongs";
import EmptyTest from "../../EmptyTest";
import {Route} from "react-router-native";

const StyledContent = styled(Content)`
    display: flex;
    background-color: gray;
`;

export default class AppContent extends Component<Props> {

    render() {
        return (
            <StyledContent>
                <Route exact path={"/home/topSongs"} component={TopSongs}/>
                <Route exact path={"/home/emptyTest"} component={EmptyTest}/>
            </StyledContent>
        );
    }
}