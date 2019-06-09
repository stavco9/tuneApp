import * as React from 'react';
import {TouchableNativeFeedback} from 'react-native';
import {Icon} from 'native-base';

const TouchableIcon = props => (
    <TouchableNativeFeedback
        borderless={props.borderless}
        disabled={props.disabled}
        onPress={props.onPress}
        background={TouchableNativeFeedback.Ripple('ThemeAttrAndroid', true)}
    >
        <Icon name={props.name} style={{color:'gray', fontSize: 20}}/>
    </TouchableNativeFeedback>
);

export default TouchableIcon;