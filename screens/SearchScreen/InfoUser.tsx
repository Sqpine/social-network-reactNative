import {Text, View} from "../../components/Themed";
import {FontAwesome5} from "@expo/vector-icons";
import * as React from "react";
import {StyleSheet} from "react-native";

type PropsType={
    text:string
    ico:string
}
const InfoUser:React.FC<PropsType> = ({text,ico}) => {
    return (
        <View style={styles.container}>
            <FontAwesome5 name={ico} size={64} color="black"/>
            <Text>{text}</Text>
        </View>
    )
}
export default InfoUser

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})