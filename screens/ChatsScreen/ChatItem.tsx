import React, {useState} from "react";
import {Text, View} from "../../components/Themed";
import {UserType} from "../../redux/reducers/user";
import {Image, StyleSheet, TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";
import {MaterialIcons} from '@expo/vector-icons';
import {arrayRemove, deleteDoc, doc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {removeChats} from "../../redux/reducers/chats";
import {useDispatch} from "react-redux";

type PropsType = {
    chatID: string
    users: string[]
    preview: null | UserType
}

const ChatItem: React.FC<PropsType> = ({chatID, preview, users}) => {
    const {navigate} = useNavigation<NativeStackScreenProps<RootTabParamList, 'Chats'>['navigation']>()
    const [isFetching, setFetching] = useState(false)
    const dispatch = useDispatch<any>()

    const uri = preview?.uri
    const name = preview ? preview.name : 'Unknown User'
    const email = preview?.email

    const deleteChat = async () => {
        setFetching(true)
        try {
            let chatRef = doc(db, "chats", chatID)
            await deleteDoc(chatRef)

            users.forEach(async (user) => {
                chatRef = doc(db, 'users', user);
                await updateDoc(chatRef, {chatsID: arrayRemove(chatID)});
            })

            chatRef = doc(db, "messages", chatID)
            await deleteDoc(chatRef)
            dispatch(removeChats(chatID))
            alert("Deleted")
        } catch (e) {
            if (!e.message) return
            alert(e.message)
        }
        setFetching(false)
    }
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
            {isFetching ?
                <MaterialIcons style={{paddingHorizontal: 10}} name="auto-delete" size={24} color="black"/>
                :
                <TouchableOpacity onPress={() => deleteChat()}>
                    <MaterialIcons style={{paddingHorizontal: 10}} name="delete" size={24} color="black"/>
                </TouchableOpacity>
            }
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
        alignItems: 'center',
        marginVertical: 10
    }
});