import React, {useEffect} from "react";
import styled from "styled-components";
import {View} from 'react-native';
import {Container, Drawer} from 'native-base';
import AppHeader from "./AppHeader/AppHeader";
import AppContent from "./AppContent/AppContent";
import SideBar from "./SideBar/SideBar"
import Player from "../Player/Player";
import TrackPlayer from "react-native-track-player";


const StyledShellPage = styled(Container)`
    display: flex;
    width: 100%;
    height: 100%;
`;

const Shell = props => {
    let drawer;

    const initPlayer = async () => {
        await TrackPlayer.setupPlayer();
    };

    useEffect(() => {
        initPlayer();
    }, []);

    const closeDrawer = () => {
        drawer._root.close()
    };

    const openDrawer = () => {
        drawer._root.open()
    };

    return (
        <Drawer content={<SideBar/>} ref={(ref) => {
            drawer = ref;
        }} onClose={() => closeDrawer()}>
            <StyledShellPage>
                <AppHeader drawer={openDrawer}/>
                <AppContent/>
                <View style={{position: 'relative', left: 0, right: 0, bottom: -10}}>
                    <Player/>
                </View>
            </StyledShellPage>
        </Drawer>
    );
};

export default Shell;