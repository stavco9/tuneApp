import React from "react";
import {Image, TouchableNativeFeedback, View} from "react-native";

function LoginIcon(imageUrl) {
    return <TouchableNativeFeedback>
        <View>
            <Image style={{width: 50, height: 50}}
                   source={require('../../assets/sign-in-with-google.png')}/>
        </View>
    </TouchableNativeFeedback>
}
export default LoginIcon;