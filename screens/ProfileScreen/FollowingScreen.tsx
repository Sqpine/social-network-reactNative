import * as React from "react";
import {useCallback, useEffect, useMemo, useState} from "react";
import User from "../SearchScreen/User";
import {UserType} from "../../redux/reducers/user";
import {doc, getDoc} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {ScrollView, StyleSheet} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";

type PropsType = {
    navigation: NativeStackScreenProps<RootTabParamList, 'Following'>['navigation']
}
const FollowingScreen: React.FC<PropsType> = ({navigation}) => {
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

    const onPressHandler = useCallback((id: string) => {
        navigation.navigate('Profile', {id: id})
    }, [])

    const usersList = useMemo(
        () => users.map(({id, name, uri, email}) =>
            <User
                key={id}
                id={id}
                name={name}
                email={email}
                uri={uri}
                onPressHandler={onPressHandler}
                showFollow
            />
        )
        , [users]
    )
    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            {usersList}
        </ScrollView>
    )
}
export default FollowingScreen
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 5
    },
})