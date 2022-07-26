import {View} from "./Themed";
import {ActivityIndicator, StyleSheet} from "react-native";
import React from "react";

type PropsType = {
    size: number | "small" | "large" | undefined
    color:string
}
const Loader: React.FC<PropsType> = ({size,color}) => {
    return (
        <View style={styles.loader}>
            <ActivityIndicator color={color} size={size}/>
        </View>
    )
}
export default Loader

const styles = StyleSheet.create({
    loader: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})