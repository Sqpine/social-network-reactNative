import * as React from "react";
import {useCallback, useEffect, useMemo, useState} from "react";
import {ScrollView, StyleSheet} from "react-native";
import SearchBar from "../components/SearchBar";
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import {auth, db} from "../firebase";
import User from "./SearchScreen/User";
import {UserType} from "../redux/reducers/user";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../types";
import LoaderScreen from "../components/LoaderScreen";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";
import Loader from "../components/Loader";
import InfoUser from "./SearchScreen/InfoUser";
import {View} from "../components/Themed";
import {ChatType} from "../redux/reducers/chats";

type PropsType = NativeStackScreenProps<RootTabParamList, 'ChoseUser'>
const ChoseUserScreen: React.FC<PropsType> = ({navigation}) => {
    const followedUsers = useSelector<RootState, string[]>(state => state.userState.yourFollowedUsers)
    const chats = useSelector<RootState, ChatType[]>(state => state.chatsState.chats)
    const [isFetching, setFetching] = useState(false)
    const [isFetchingUser, setFetchingUser] = useState(true)
    const [users, setUsers] = useState<UserType[]>([])
    const [userName, setUserName] = useState('')
    const uid = auth.currentUser!.uid

    useEffect(() => {
        getFollowedUsers()
    }, [])

    const getFollowedUsers = async () => {
        setFetchingUser(true)
        const currentUsers: UserType[] = []

        for await (const id of followedUsers) {
            const response = await getDoc(doc(db, 'users', id))
            if (response.exists()) {
                currentUsers.push({...response.data() as UserType, id: response.id})
            }
        }
        setUsers(currentUsers)
        setFetchingUser(false)
    }

    const searchSubmit = async () => {
        if (!userName.trim()) {
            getFollowedUsers()
            return
        }
        const q = query(
            collection(db, 'users'),
            where('name', '>=', userName),
            where('name', '<=', userName + '\uf8ff')
        );
        setFetchingUser(true)
        await getData(q)
        setFetchingUser(false)
    }

    const getData = async (q: any) => {
        const querySnapshot = await getDocs(q)
        let response: UserType[] = []
        await querySnapshot.forEach((doc) => {
            if (doc.id === uid) return
            const userData = doc.data() as UserType
            response = [...response, {...userData, id: doc.id}]
        });
        setUsers(response)
    }

    const onPressHandler = useCallback(async (id: string, name: string) => {
        const index = chats.findIndex((e)=>e.users.includes(id))

        if(index > -1){
            navigation.navigate('Messages', {chatID: chats[index].chatID, userName: name})
            return
        }
        setFetching(true)
        let chatRef
        chatRef = collection(db, 'chats');
        const createdDoc = await addDoc(chatRef, {users: [id, uid]})

        chatRef = doc(db, 'chats', createdDoc.id);
        await updateDoc(chatRef, {chatID: createdDoc.id})

        for await (const currentID of [id, uid]) {
            chatRef = doc(db, 'users', currentID);
            await updateDoc(chatRef, {chatsID: arrayUnion(createdDoc.id)})
        }

        chatRef = doc(db, 'messages', createdDoc.id);
        await setDoc(chatRef, {messages: []})

        navigation.navigate('Messages', {chatID: createdDoc.id, userName: name})
    }, [])

    const usersList = useMemo(() => users.map(({id, name, uri, email}) =>
            <User
                key={id}
                id={id}
                name={name}
                email={email}
                uri={uri}
                onPressHandler={onPressHandler}
                showFollow={false}/>)
        , [users]
    )

    if (isFetching) {
        return <LoaderScreen text="Creating chat. . ."/>
    }

    return (
        <View style={styles.container}>
            <SearchBar
                placeHolder={'Search'}
                isFocus={false}
                searchSubmit={searchSubmit}
                setUserName={setUserName}
                userName={userName}
            />
            {isFetchingUser ?
                <Loader color="#0000ff" size="large"/>
                :
                usersList.length > 0 ?
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            usersList
                        }
                    </ScrollView>
                    :
                    <InfoUser text="No similar users found" ico="users-slash"/>
            }
        </View>
    )
}
export default ChoseUserScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 5
    },
})