import {Text, View} from "../../components/Themed";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";
import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {MessageType, setMessages} from "../../redux/reducers/chats";
import {arrayUnion, doc, onSnapshot, updateDoc} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {RootState} from "../../redux/store";
import Message from "./Message";
import {ScrollView, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import {Ionicons} from '@expo/vector-icons';
import firebase from "firebase/compat";
import Loader from "../../components/Loader";

type PropsType = {
    route: NativeStackScreenProps<RootTabParamList, 'Messages'>['route']
}
const MessagesScreen: React.FC<PropsType> = ({route}) => {
    const {params} = route
    const scrollViewRef = useRef<ScrollView>(null);
    const messages = useSelector<RootState, MessageType[]>(state => state.chatsState.messages)
    const [message, setMessage] = useState('')
    const [isFetching, setFetching] = useState(false)
    const [isFetchingMessages, setFetchingMessages] = useState(true)
    const dispatch = useDispatch<any>()

    useEffect(() => {
        if (!params.chatID) return
        scrollViewRef.current?.scrollToEnd({animated: true})
        setFetchingMessages(true)
        const unsubscribe = onSnapshot(doc(db, "messages", params.chatID), (res) => {
            const resp = res.data() as { messages: MessageType[] }
            setFetchingMessages(false)
            if (messages.length === 0 && resp.messages.length === 0) return
            dispatch(setMessages(resp.messages))
        })
        return () => {
            dispatch(setMessages([]))
            unsubscribe()
        }
    }, [params.chatID])

    const postMessage = async () => {
        if (!message.trim() && isFetching) return
        setFetching(true)
        const docRef = doc(db, "messages", params.chatID);
        const messageData = {
            id: auth.currentUser!.uid,
            message,
            date: firebase.firestore.Timestamp.now(),
        }
        await updateDoc(docRef, {messages: arrayUnion(messageData)});
        setFetching(false)
        setMessage('')
    }

    return (<View style={{flex: 1}}>
            {isFetchingMessages?
                <Loader color="#0000ff" size="large"/>
                :
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.contentContainer}
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => {
                        scrollViewRef.current?.scrollToEnd({animated: true})
                    }
                    }
                >
                    <View style={styles.messages}>
                        {messages.map(({message, id, date}) => (
                                <Message
                                    key={`${id}${date}${message}`}
                                    message={message}
                                    id={id}
                                    date={date}
                                />
                            )
                        )}
                    </View>
                </ScrollView>
            }
            {
                isFetching &&
                <Text
                    style={styles.loader}
                >
                    Sending . . .
                </Text>
            }
            <View style={{paddingHorizontal: 10}}>
                <View style={styles.inputField}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Your message"
                            value={message}
                            onChangeText={(t) => setMessage(t)}
                            onSubmitEditing={postMessage}
                        />
                    </View>
                    <TouchableOpacity onPress={postMessage}>
                        <Ionicons style={styles.search} name="send" size={24} color="black"/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
export default MessagesScreen

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        maxHeight: '90%'
    },
    contentContainer: {
        flexGrow: 1,
        paddingVertical: 5,
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    messages: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
    },
    inputField: {
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(118, 118, 128, 0.12)',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    inputContainer: {
        maxWidth: '85%',
        minWidth: '80%',
        width: 'auto',
    },
    input: {
        color: 'rgba(60, 60, 67, 0.6)',
        height: 40,
        backgroundColor: 'rgba(118, 118, 128, 0.12)'
    },
    search: {
        marginHorizontal: 10,
    },
    loader:{
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingVertical: 5
    }
})