import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Content} from 'native-base';
import TopSongs from "../../TopSongs";
import EmptyTest from "../../EmptyTest";
import {Route} from "react-router-native";
import axios from "axios";
import {connect} from "react-redux";
import {SetInitialStats} from "../../../redux/actions/like-actions";

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
        <StyledContent>
            <Route exact path={"/home/topSongs"} render={(routeProps) =>
                <TopSongs {...routeProps} isUserLikedTracksLoaded={isUserLikedTracksLoaded}/>}/>
            <Route exact path={"/home/emptyTest"} component={EmptyTest}/>
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