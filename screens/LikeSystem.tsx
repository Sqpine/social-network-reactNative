import React, {useEffect, useState} from "react";
import {auth, db} from "../firebase";
import {deleteDoc, doc, onSnapshot, setDoc, updateDoc} from "firebase/firestore";
import {AntDesign} from "@expo/vector-icons";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Text} from "../components/Themed";

type PropsType = {
    userId: string
    postId: string
    likesCount: number
}
const LikeSystem: React.FC<PropsType> = ({postId, userId, likesCount}) => {
    const uid = auth.currentUser!.uid
    const [currentUserLike, setCurrentUserLike] = useState(false)
    const [isFetching, setFetching] = useState(false)
    const [amountOfLikes, setAmountOfLikes] = useState(likesCount)
    useEffect(() => {
        onSnapshot(doc(db, 'post', userId, 'userPosts', postId, 'likes', uid), (res) => {
            let currentUserLike = false;
            if (res.exists()) {
                currentUserLike = true;
            }
            setCurrentUserLike(currentUserLike)
        })
    }, [])

    const setLikeHandle = async () => {
        if (isFetching) return
        const currentAmoutOfLikes = amountOfLikes + 1
        setFetching(true)
        await setDoc(doc(db, 'post', userId, 'userPosts', postId, 'likes', uid), {})
        await saveLikeCount(currentAmoutOfLikes)
        setFetching(false)
        setAmountOfLikes(currentAmoutOfLikes)
    }
    const removeLikeHandle = async () => {
        if (isFetching) return
        const currentAmoutOfLikes = amountOfLikes - 1
        setFetching(true)
        await deleteDoc(doc(db, 'post', userId, 'userPosts', postId, 'likes', uid))
        await saveLikeCount(currentAmoutOfLikes)
        setFetching(false)
        setAmountOfLikes(currentAmoutOfLikes)
    }
    const saveLikeCount = async (amountOfLikes: number) => {
        await updateDoc(doc(db, 'post', uid, 'userPosts', postId), {
            likesCount: amountOfLikes
        });
    }
    return (
        <TouchableOpacity style={styles.footerLike}>
            {
                currentUserLike ?
                    <>
                        <AntDesign onPress={removeLikeHandle} name="heart" size={24} color="red"/>
                        <Text style={{marginHorizontal: 10, fontSize: 15}}>{amountOfLikes}</Text>
                    </>
                    :
                    <>
                        <AntDesign onPress={setLikeHandle} name="hearto" size={24} color="black"/>
                        <Text style={{marginHorizontal: 10, fontSize: 15, color: 'black'}}>{amountOfLikes}</Text>
                    </>

            }
        </TouchableOpacity>
    )
}
export default LikeSystem

const styles = StyleSheet.create({
    footerLike: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
});