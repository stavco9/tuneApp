import React, {Component,} from "react";
import styled from "styled-components";
import {Container, Drawer} from 'native-base';
import AppHeader from "./AppHeader/AppHeader";
import AppContent from "./AppContent/AppContent";
import SideBar from "./SideBar/SideBar";
import GestureRecognizer from "react-native-swipe-gestures";

const StyledShellPage = styled(Container)`
    display: flex;
    width: 100%;
    height: 100%;
`;

export default class Shell extends Component<Props> {
    closeDrawer = () => {
        this.drawer._root.close()
    };

    openDrawer = () => {
        this.drawer._root.open()
    };

    render() {
        return (
            <GestureRecognizer onSwipe={(direction, state) => console.log(direction + ' ' + state)}>
                <Drawer content={<SideBar/>} ref={(ref) => {
                    this.drawer = ref
                }} onClose={() => this.closeDrawer()}>

                    <StyledShellPage>
                        <AppHeader drawer={this.openDrawer}/>

                        <AppContent/>

                    </StyledShellPage>
                </Drawer>
            </GestureRecognizer>
        );
    }
}