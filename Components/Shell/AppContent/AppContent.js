import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Content} from 'native-base';
import TopSongs from "../../TopSongs";
import {Route} from "react-router-native";
import axios from "axios";
import {connect} from "react-redux";
import {SetInitialStats} from "../../../redux/actions/like-actions";
import ExpandedSongCard from "../../ExpandedSongCard";
import Search from "../../Search";
import UserPlaylist from '../../UserPlaylist';

const StyledContent = styled(Content)`
    display: flex;
    background-color: gray;
`;

const AppContent = props => {
    const [isUserLikedTracksLoaded, setIsUserLikedTracksLoaded] = useState(false);
    useEffect(() => {
        axios.get('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/users/my/')
            .then(({data}) => {
                props.setInitialStats(data);
                setIsUserLikedTracksLoaded(true);
            });
    }, []);

    return (
        <StyledContent style={{backgroundColor:'white'}}>
            <Route exact path={"/home/topSongs"} render={(routeProps) => <TopSongs {...routeProps} isUserLikedTracksLoaded={isUserLikedTracksLoaded}/>}/>
            <Route exact path={"/home/userPlaylist"} render={(routeProps) =>
                <UserPlaylist {...routeProps} isUserLikedTracksLoaded={isUserLikedTracksLoaded}/>}/>
            <Route exact path={"/home/search"} component={Search}/>
            <Route exact path={"/home/selectedSong"} component={ExpandedSongCard}/>
        </StyledContent>
    );
};

const mapDispatchToProps = dispatch => {
    return {
        setInitialStats: (stats) => {
            dispatch(SetInitialStats(stats));
        },
    }
};


export default connect(null, mapDispatchToProps)(AppContent);