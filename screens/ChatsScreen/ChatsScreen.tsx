import {View} from "../../components/Themed";
import * as React from "react";
import {useEffect, useState} from "react";
import {doc, getDoc} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {UserType} from "../../redux/reducers/user";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {ChatType, setChats} from "../../redux/reducers/chats";
import ChatItem from "./ChatItem";
import SearchBar from "../../components/SearchBar";
import {StyleSheet} from "react-native";

export type ChatRespType = {
    chatId: string
    users: string[]
}
const ChatsScreen = () => {
    const [userName, setUserName] = useState('')
    const user = useSelector<RootState, UserType | null>(state => state.userState.user)
    const chats = useSelector<RootState, ChatType[]>(state => state.chatsState.chats)
    const dispatch = useDispatch<any>()
    const uid = auth.currentUser!.uid

    useEffect(() => {
        doSome().then(chats => dispatch(setChats(chats)))
    }, [])

    const doSome = async () => {
        if (user) {
            let preview: null | UserType = null
            const res = user.chatsID.map(async (id) => {
                const docRef = doc(db, "chats", id);
                const docSnap = await getDoc(docRef);
                const resp = docSnap.data() as ChatRespType
                const index = resp.users.findIndex(id => id !== uid)

                if (index > -1) {
                    const id = resp.users[index]
                    const docRef = doc(db, "users", id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap && docSnap.exists()) {
                        preview = docSnap.data() as UserType
                    } else {
                        console.log("No such document!");
                    }
                }
                return {preview, ...resp}
            });
            Promise.all(res).then(p => dispatch(setChats(p)))
        }
        return []
    }
    const searchSubmit = () => {

    }
    return (
        <View style={styles.container}>
            <SearchBar
                isFocus={false}
                searchSubmit={searchSubmit}
                setUserName={setUserName}
                userName={userName}
                placeHolder={'Search'}
            />
            <View>
                {chats.map
                (
                    ({chatId, users, preview}) => (
                        <ChatItem
                            key={chatId}
                            chatID={chatId}
                            users={users}
                            preview={preview}
                        />
                    )
                )
                }
            </View>
        </View>
    )
}
export default ChatsScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 5
    }
})