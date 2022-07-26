import {Image} from 'react-native'
import {Text, View} from "./Themed";
import React from "react";

type PropsType={
    text:string
}
const LoaderScreen:React.FC<PropsType> = ({text}) => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image style={{width: 150, height: 150}} source={require('../assets/images/loading.gif')}/>
            <Text>
                {text}
            </Text>
        </View>
    )
}
export default LoaderScreen