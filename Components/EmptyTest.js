import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {Image} from 'react-native';
import {Body, Button, Card, CardItem, Icon, Right, Text, View} from 'native-base';

const StyledTopSongsContainer = styled(View)`
    display: flex;
    background-color: #9FA8DA;
    flex-flow: row wrap;
    justify-content:space-evenly;
    align-items:center;
`;

const EmptyTest = props => {
    return (
        <StyledTopSongsContainer>
        </StyledTopSongsContainer>
    )
};

export default EmptyTest;