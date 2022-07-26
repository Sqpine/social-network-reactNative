import React from "react";
import {Text, View} from "../../components/Themed";
import firebase from "firebase/compat";
import {auth} from "../../firebase";
import {Animated, StyleSheet} from "react-native";
import {LinearGradient} from "expo-linear-gradient";

type PropsType = {
    message: string
    id: string
    date: firebase.firestore.Timestamp
}


const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const Message: React.FC<PropsType> = ({id, message, date}) => {
    const currentId = auth.currentUser!.uid
    const formattedData = date.toDate().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})

    if (currentId === id) {
        return (
            <AnimatedLinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                locations={[0.0, 0.99]}
                colors={["rgba(99,64,236,1)", "rgba(144,50,236,1)"]}
                style={[styles.message, styles.yourMessage]}>
                <Text style={{color: 'white'}}>
                    {message}
                </Text>
                <Text style={{color: 'gray', fontSize: 10, marginRight: 'auto'}}>
                    {formattedData}
                </Text>
            </AnimatedLinearGradient>
        )
    }
    return (
        <View style={[styles.message, styles.friendsMessage]}>
            <Text>
                {message}
            </Text>
            <Text style={{color: 'gray', fontSize: 10, marginLeft: 'auto'}}>
                {formattedData}
            </Text>
        </View>
    )
}
export default Message

const styles = StyleSheet.create({
    message: {
        marginVertical: 4,
        padding: 10,
        minWidth: 'auto',
        maxWidth: '50%',
        borderRadius: 20,
    },
    yourMessage: {
        marginLeft: 'auto',
    },
    friendsMessage: {
        marginRight: 'auto',
        backgroundColor: '#F1F1F1',
    }
})