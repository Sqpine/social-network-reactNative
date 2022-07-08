import {Button, Image, StyleSheet, TouchableOpacity} from "react-native";
import {Text, View} from "../../components/Themed";
import * as React from "react";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";
import FollowUnFollow from "../ProfileScreen/FollowUnFollow";

type PropsType = {
    id: string
    name: string
    email: string
    uri:string
}
const User: React.FC<PropsType> = ({id, name, uri,email}) => {
    const navigation = useNavigation<NativeStackScreenProps<RootTabParamList, 'Search'>['navigation']>()
    return (
        <View key={id} style={styles.userContainer}>
            <TouchableOpacity
                style={styles.user}
                onPress={() => navigation.navigate('Profile', {id})}
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
            <FollowUnFollow id={id}/>
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