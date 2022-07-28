import {StyleSheet, TouchableOpacity} from "react-native";
import {Text} from "../../components/Themed";
import React, {useEffect, useState} from "react";
import {deleteDoc, doc, setDoc} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import Loader from "../../components/Loader";

type PropsType = {
    id: string
}
const FollowUnFollow: React.FC<PropsType> = ({id}) => {
    const yourFollowedUsers = useSelector<RootState, string[]>(state => state.userState.yourFollowedUsers)
    const [isFollowing, setFollowing] = useState(yourFollowedUsers.indexOf(id) > -1)
    const [isFetching, setFetching] = useState(false)
    const currentId = auth.currentUser!.uid

    const Follow = async () => {
        setFetching(true)
        const querySnapshot = await setDoc(doc(db, 'following', currentId, 'userFollowing', id), {})
        setFetching(false)
    }
    const Unfollow = async () => {
        setFetching(true)
        const querySnapshot = await deleteDoc(doc(db, 'following', currentId, 'userFollowing', id))
        setFetching(false)
    }

    useEffect(() => {
        if (yourFollowedUsers.indexOf(id) > -1) {
            setFollowing(true)
        } else setFollowing(false)
    }, [id, yourFollowedUsers.length])

    if (isFetching) return (
        <TouchableOpacity style={[styles.button, styles.activeFollow,styles.loader]} onPress={() => Unfollow()}>
            <Loader color="#0000ff" size="small"/>
        </TouchableOpacity>
    )
    else if (isFollowing) return (
        <TouchableOpacity
            style={[styles.button, styles.activeFollow]}
            onPress={() => Unfollow()}
        >
            <Text style={{
                fontWeight: 'bold',
            }}>
                Unfollow
            </Text>
        </TouchableOpacity>
    )
    return (
        <TouchableOpacity
            style={[styles.button, styles.unActiveFollow]}
            onPress={() => Follow()}
        >
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

const styles = StyleSheet.create({
    button: {
        borderRadius: 5,
        padding: 8,
        alignItems: 'center',
        borderWidth: 1,
    },
    loader:{
      paddingHorizontal:25
    },
    activeFollow: {
        borderColor: 'rgba(60, 60, 67, 0.18)',
    },
    unActiveFollow: {
        backgroundColor: '#3797EF',
        borderColor: 'rgba(60, 60, 67, 0.18)',
    }
})