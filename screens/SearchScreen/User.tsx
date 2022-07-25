import {Image, StyleSheet, TouchableOpacity} from "react-native";
import {Text, View} from "../../components/Themed";
import * as React from "react";
import FollowUnFollow from "../ProfileScreen/FollowUnFollow";
import {auth} from "../../firebase";

type PropsType = {
    id: string
    name: string
    email: string
    uri: string
    onPressHandler: (id: string) => void
    showFollow: boolean
}
const User: React.FC<PropsType> = ({id, onPressHandler, showFollow, name, uri, email}) => {
    return (
        <View key={id} style={styles.userContainer}>
            <TouchableOpacity
                style={styles.user}
                onPress={() => onPressHandler(id)}
            >
                <Image style={styles.avatar} source={uri ? ({uri}) : require('../../assets/images/noAvatar.png')}/>
                <View style={styles.userInfo}>
                    <Text>
                        {name}
                    </Text>
                    <Text>
                        {email}
                    </Text>
                </View>
            </TouchableOpacity>
            {showFollow && id !== auth.currentUser!.uid
                &&
                <FollowUnFollow id={id}/>
            }
        </View>
    )
}
export default User
const styles = StyleSheet.create({
    avatar: {
        width: 30,
        height: '100%'
    },
    user: {
        flexDirection: 'row'
    },
    userInfo: {
        marginHorizontal: 10
    },
    userContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    }
});