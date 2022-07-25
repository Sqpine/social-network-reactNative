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
        setAmountOfLikes(prevState => prevState + 1)
        setFetching(true)
        const currentId = auth.currentUser!.uid
        await setDoc(doc(db, 'post', userId, 'userPosts', postId, 'likes', currentId), {})
        await saveLikeCount()
        setFetching(false)
    }
    const removeLikeHandle = async () => {
        if (isFetching) return
        setAmountOfLikes(prevState => prevState - 1)
        setFetching(true)
        const currentId = auth.currentUser!.uid
        await deleteDoc(doc(db, 'post', userId, 'userPosts', postId, 'likes', currentId))
        await saveLikeCount()
        setFetching(false)
    }
    const saveLikeCount = async () => {
        const uid = auth.currentUser!.uid
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
                        <Text>{amountOfLikes}</Text>
                    </>
                    :
                    <>
                        <AntDesign onPress={setLikeHandle} name="hearto" size={24} color="black"/>
                        <Text>{amountOfLikes}</Text>
                    </>

            }
        </TouchableOpacity>
    )
}
export default LikeSystem
const styles = StyleSheet.create({
    footerLike: {
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
});