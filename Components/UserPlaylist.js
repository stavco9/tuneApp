import axios from "axios";
import React, {useEffect, useState} from 'react'
import {SetUserPlaylist} from "../redux/actions/songs-actions";
import {connect} from "react-redux";
import {List, Spinner} from "native-base";
import SongItem from "./common/SongItem";
import CompactSong from "./CompactSongList/CompactSong";

const UserPlaylist = props => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        axios.get('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/playlist/build')
            .then(({data: fetchedSongs}) => {
                props.setUserPlaylist([...fetchedSongs]);
                setIsLoading(false);
            });
    }, []);

    return (
        <List style={{width: '100%'}}>
            {isLoading ? <Spinner color={'#3c50b5'}/> :
                props.songReducer.userPlaylist.map(song => {
                    const SongCardItem = SongItem(CompactSong, song, props.songReducer.userPlaylist);
                    return <SongCardItem/>
                })
            }
        </List>
    );
};

const mapStateToProps = state => {
    console.log(state);
    return {
        songReducer: state.songReducer
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setUserPlaylist: userPlaylist => {
            dispatch(SetUserPlaylist(userPlaylist));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPlaylist);