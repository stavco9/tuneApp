import React, {Component} from "react";
import {Container, ListItem, Text, List} from "native-base";
import {Route, Link} from "react-router-native";
import TopSongs from "../../TopSongs";
import styled from "styled-components";

const routes = ["Home", "Chat", "Profile"];

const StyledSideBarContainer = styled(Container)`
    display: flex;
    background-color: #3F51B5;
    flex-flow: row wrap;
    justify-content:space-evenly;
    align-items:center;
`;
const StyledSideBarLink = styled(Link)`
    display: flex;
    flex-flow: row wrap;
    justify-content:space-evenly;
    align-items:center;
    width:100%;
    
`;

const StyledSideBarText = styled(Text)`
    font-size: 20px;
`;

const StyledSideBarListItem = styled(ListItem)`
    background-color: #1719b5;
`;

export default class SideBar extends Component<Props> {
    render() {
        return (
            <StyledSideBarContainer>
                <List>
                    <StyledSideBarListItem itemDivider>
                        <StyledSideBarLink to="/home/topSongs" underlayColor="#f0f4f7">
                            <StyledSideBarText>Top Songs</StyledSideBarText>
                        </StyledSideBarLink>
                    </StyledSideBarListItem>
                    <StyledSideBarListItem itemDivider>
                        <StyledSideBarLink to="/home/emptyTest" underlayColor="#f0f4f7">
                            <StyledSideBarText>Empty Test</StyledSideBarText>
                        </StyledSideBarLink>
                    </StyledSideBarListItem>
                </List>
            </StyledSideBarContainer>
        );
    }
}