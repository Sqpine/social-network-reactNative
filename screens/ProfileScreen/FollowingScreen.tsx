import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import User from "../SearchScreen/User";
import {UserType} from "../../redux/reducers/user";
import {doc, getDoc} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {ScrollView} from "react-native";

const FollowingScreen = () => {
    const followedUsers = useSelector<RootState, string[]>(state => state.userState.followedUsers)
    const [users, setUsers] = useState<UserType[]>([])
    const uid = auth.currentUser!.uid

    useEffect(() => {
        followedUsers.forEach(async (user) => {
            const docRef = doc(db, "users", user);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const id = docSnap.id
                const resp = docSnap.data() as UserType
                setUsers(prevState => [...prevState, {...resp, id}])
            } else {
                console.log("No such document!");
            }
        })
    }, [])

    const usersList = useMemo(
        () => users.map(({id, name, uri, email}) =>
            <User key={id} id={id} name={name} email={email} uri={uri}/>
        )
        , [users]
    )
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
        >
            {usersList}
        </ScrollView>
    )
}
export default FollowingScreen