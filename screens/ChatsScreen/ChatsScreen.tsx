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
import {ScrollView, StyleSheet} from "react-native";
import Loader from "../../components/Loader";
import InfoUser from "../SearchScreen/InfoUser";

export type ChatRespType = {
    chatId: string
    users: string[]
}
const ChatsScreen = () => {
    const [userName, setUserName] = useState('')
    const user = useSelector<RootState, UserType | null>(state => state.userState.user)
    const chats = useSelector<RootState, ChatType[]>(state => state.chatsState.chats)

    const [isFetching, setFetching] = useState(true)
    const [chatList, setChatList] = useState<ChatType[]>(chats)
    const [isExist, setExist] = useState(true)
    const dispatch = useDispatch<any>()
    const uid = auth.currentUser!.uid

    useEffect(() => {
        doSome().then(chats => {
            dispatch(setChats(chats))
            setFetching(false)
        })
        return () => {
            dispatch(setChats([]))
        }
    }, [])

    useEffect(() => {
        setChatList(chats)
    }, [chats])

    const doSome = async () => {
        if (user) {
            let preview: null | UserType = null
            setFetching(true)
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
        if (!userName.trim()) {
            if (chats.length === 0 && chats.length > 0) setExist(false)
            else setExist(true)
            setChatList(chats)
            return
        }
        const filteredValue = chats.filter(chat => chat.preview?.name.toLowerCase().includes(userName.toLowerCase()))
        if (filteredValue.length === 0 && chats.length > 0) setExist(false)
        else setExist(true)
        setChatList(filteredValue)
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
            {isFetching || chats.length === 0 &&
                <Loader color="#0000ff" size="large"/>
            }
            {!isFetching && chats.length > 0 && isExist &&
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {chatList.map
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
                </ScrollView>
            }
            {isFetching && chats.length === 0 &&
                <InfoUser ico="rocketchat" text="Please create a chat"/>
            }
            {!isFetching && !isExist ?
                <InfoUser ico="exclamation" text="No similar chats found"/>
                :
                null
            }
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