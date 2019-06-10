import React, {useEffect} from "react";
import styled from 'styled-components';
import {View} from 'native-base';
import axios from 'axios';
import {connect} from "react-redux";
import {SetTopSongs} from "../redux/actions/songs-actions";
import SongCard from './SongCardList/SongCard';
import SongItem from "./common/SongItem";

const StyledTopSongsContainer = styled(View)`
    display: flex;
    background-color: #C5CAE9;
    flex-flow: row wrap;
    flex: 1;
    width: 100%;
    justify-content: space-evenly;
    align-items: center;
`;

const TopSongs = props => {
    useEffect(() => {
        if (props.isUserLikedTracksLoaded && !props.songReducer.topSongs.length) {
            axios.get('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/top/30')
                .then(({data: fetchedSongs}) => {
                    props.setTopSongs([...fetchedSongs]);
                });
        }
    }, [props.isUserLikedTracksLoaded]);

    return (
        <StyledTopSongsContainer>
            {
                props.songReducer.topSongs.map(song => {
                    const playlistContext = props.songReducer.topSongs.slice(props.songReducer.topSongs.indexOf(song));
                    const SongCardItem = SongItem(SongCard, song, playlistContext);
                    return <SongCardItem key={song.id}/>
                })
            }
        </StyledTopSongsContainer>
    )
};

const mapStateToProps = state => {
    console.log(state);
    return {
        songReducer: state.songReducer
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setTopSongs: topSongs => {
            dispatch(SetTopSongs(topSongs));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TopSongs);