import React, { Fragment } from 'react';
import {Text, ProgressBar} from 'native-base'
import { ProgressComponent } from 'react-native-track-player';
import { StyleSheet } from 'react-native';

import { leftPad } from './Utils';

class ProgressBarA extends ProgressComponent<> {
    render() {
        const { theme } = this.props;
        const { duration, position } = this.state;

        return (
            <Fragment>
                <Text style={{fontSize:14}}>
                    0:{leftPad(Math.floor(position), 2)}
                    <Text style={{ color: "gray",fontSize:14 }}>
                        {' '}
                        / 0:{leftPad(Math.round(duration), 2)}
                    </Text>
                </Text>
            </Fragment>
        );
    }
}

const styles = StyleSheet.create({
    progressBar: {
        paddingVertical: 0,
    },
});

export default ProgressBarA;
