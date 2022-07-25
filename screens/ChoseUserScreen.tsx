import * as React from "react";
import {useCallback, useEffect, useMemo, useState} from "react";
import {ScrollView} from "react-native";
import SearchBar from "../components/SearchBar";
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import {auth, db} from "../firebase";
import User from "./SearchScreen/User";
import {UserType} from "../redux/reducers/user";

const ChoseUserScreen = () => {
    const [users, setUsers] = useState<UserType[]>([])
    const [userName, setUserName] = useState('')
    const uid = auth.currentUser!.uid
    useEffect(() => {
        getAllUsers()
    }, [])
    const getAllUsers = async () => {
        const q = query(collection(db, 'users'), orderBy("name", "desc"), limit(20));
        await getDoc(q)
    }
    const searchSubmit = async () => {
        if (!userName) return
        const q = query(
            collection(db, 'users'),
            where('name', '>=', userName),
            where('name', '<=', userName + '\uf8ff')
        );
        await getDoc(q)
    }

    const getDoc = async (q: any) => {
        const querySnapshot = await getDocs(q)
        let response: UserType[] = []
        await querySnapshot.forEach((doc) => {
            if (doc.id === uid) return
            const userData = doc.data() as UserType
            response = [...response, {...userData, id: doc.id}]
        });
        setUsers(response)
    }
    const onPressHandler = useCallback((id: string) => {

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
    return (
        <ScrollView stickyHeaderIndices={[0]}
                    showsVerticalScrollIndicator={false}
        >
            <SearchBar
                placeHolder={'Search'}
                isFocus={true}
                searchSubmit={searchSubmit}
                setUserName={setUserName}
                userName={userName}
            />
            {usersList}
        </ScrollView>
    )
}
export default ChoseUserScreen