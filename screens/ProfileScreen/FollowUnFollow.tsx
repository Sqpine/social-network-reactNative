import {TouchableOpacity} from "react-native";
import {Text} from "../../components/Themed";
import React, {useEffect, useState} from "react";
import {deleteDoc, doc, setDoc} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

type PropsType = {
    id: string
}
const FollowUnFollow: React.FC<PropsType> = ({id}) => {
    const yourFollowedUsers = useSelector<RootState, string[]>(state => state.userState.yourFollowedUsers)
    const [isFollowing, setFollowing] = useState(yourFollowedUsers.indexOf(id) > -1)

    const Follow = async () => {
        const currentId = auth.currentUser!.uid
        const querySnapshot = await setDoc(doc(db, 'following', currentId, 'userFollowing', id), {})
    }
    const Unfollow = async () => {
        const currentId = auth.currentUser!.uid
        const querySnapshot = await deleteDoc(doc(db, 'following', currentId, 'userFollowing', id))
    }
    useEffect(() => {
        if (yourFollowedUsers.indexOf(id) > -1) {
            setFollowing(true)
        } else setFollowing(false)
    }, [id, yourFollowedUsers.length])

    if (isFollowing) return (
        <TouchableOpacity style={{
            marginTop: 15,
            borderRadius: 5,

            padding:8,
            alignItems: 'center',
            borderColor: 'rgba(60, 60, 67, 0.18)',
            borderWidth: 1,
        }} onPress={() => Unfollow()}>
            <Text style={{
                fontWeight: 'bold',
            }}>
                Unfollow
            </Text>
        </TouchableOpacity>
    )
    return (
        <TouchableOpacity style={{
            marginTop: 15,
            borderRadius: 5,
            padding:8,
            alignItems: 'center',
            backgroundColor: '#3797EF',
            borderColor: 'rgba(60, 60, 67, 0.18)',
            borderWidth: 1,
        }} onPress={() => Follow()}>
            <Text style={{
                color: 'white',
                fontWeight: 'bold',
            }}>
                Follow
            </Text>
        </TouchableOpacity>
    )
}
export default FollowUnFollow