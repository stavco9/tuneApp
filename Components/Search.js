import {connect} from "react-redux";
import {SetSearchedSongs} from "../redux/actions/songs-actions";
import React, {useState} from "react";
import {View, Text, Header, Item, Icon, Input, Button, List, Spinner} from 'native-base'
import styled from "styled-components";
import axios from "axios";
import SongCard from "./SongCardList/SongCard";
import SongItem from "./common/SongItem";
import CompactSong from "./CompactSongList/CompactSong";
import {ScrollView} from "react-native";

const StyledSearchContainer = styled(View)`
    background-color: #9FA8DA;
    width: 100%;
`;

const Search = props => {
    const [searchInput, setSearchInput] = useState('');

    const search = () => {
        axios.get('http://tuneapp-server-1969202483.us-east-1.elb.amazonaws.com/tracks/find/'.concat(searchInput))
            .then(({data: fetchedSongs}) => {
                props.setSearchedSongs(fetchedSongs.slice(0, 20));
            });
    };

    return (
        <View>
            <StyledSearchContainer>
                <Header searchBar rounded>
                    <Item>
                        <Icon name="search"/>
                        <Input placeholder="Search"
                               onChangeText={(text) => {
                                   setSearchInput(text);
                               }}
                               value={searchInput}
                               onSubmitEditing={() => search()}/>
                    </Item>
                    <Button transparent onPress={() => search()}>
                        <Text>Search</Text>
                    </Button>
                </Header>
            </StyledSearchContainer>
            <List style={{width: '100%'}}>
                {!props.songReducer.searchedSongs.length ? <Spinner color={'#3c50b5'}/> :
                    props.songReducer.searchedSongs.map(song => {
                        const SongCardItem = SongItem(CompactSong, song, props.songReducer.searchedSongs);
                        return <SongCardItem key={song.id}/>
                    })
                }
            </List>
        </View>
    );
};

const mapStateToProps = state => {
    console.log(state);
    return {
        likeReducer: state.likeReducer,
        songReducer: state.songReducer
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setSearchedSongs: searchedSongs => {
            dispatch(SetSearchedSongs(searchedSongs));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);