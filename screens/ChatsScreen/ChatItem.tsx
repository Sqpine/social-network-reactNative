import React from "react";
import {Text, View} from "../../components/Themed";
import {UserType} from "../../redux/reducers/user";
import {Image, StyleSheet, TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";

type PropsType = {
    chatID: string
    users: string[]
    preview: null | UserType
}

const ChatItem: React.FC<PropsType> = ({chatID, preview}) => {
    const {navigate} = useNavigation<NativeStackScreenProps<RootTabParamList, 'Chats'>['navigation']>()

    const uri = preview?.uri
    const name = preview ? preview.name : 'Unknown User'
    const email = preview?.email
    return (
        <View style={styles.userContainer}>
            <TouchableOpacity
                style={styles.user}
                onPress={() => navigate('Messages', {chatID, userName: name})}
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
        </View>
    )
}
export default ChatItem

const styles = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    user: {
        alignItems: 'center',
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