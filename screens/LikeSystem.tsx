import React, {useState} from "react";
import {auth, db} from "../firebase";
import {deleteDoc, doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {AntDesign} from "@expo/vector-icons";
import {TouchableOpacity} from "react-native";
import {UsersPostsType} from "../redux/reducers/user";

type PropsType = {
    userId: string
    postId: string
    currentUserLike: boolean
    likesCount: number
    setLikesCount: (count: number) => void
}
const LikeSystem: React.FC<PropsType> = (
    {
        currentUserLike,
        postId,
        userId,
        likesCount,
        setLikesCount
    }
) => {
    const uid = auth.currentUser!.uid
    const [isFetching, setFetching] = useState(false)

    const setLikeHandle = async () => {
        setFetching(true)

        let userPostResp = await getDoc(doc(db, 'post', userId, 'userPosts', postId))
        const userPostData = userPostResp.data() as UsersPostsType
        const currentAmountOfLikes = userPostData.likesCount + 1

        await setDoc(doc(db, 'post', userId, 'userPosts', postId, 'likes', uid), {})
        await saveLikeCount(currentAmountOfLikes)
        setFetching(false)
        setLikesCount(currentAmountOfLikes)
    }
    const removeLikeHandle = async () => {
        setFetching(true)

        let userPostResp = await getDoc(doc(db, 'post', userId, 'userPosts', postId))
        const userPostData = userPostResp.data() as UsersPostsType
        const currentAmountOfLikes = userPostData.likesCount - 1

        await deleteDoc(doc(db, 'post', userId, 'userPosts', postId, 'likes', uid))
        await saveLikeCount(currentAmountOfLikes)
        setFetching(false)
        setLikesCount(currentAmountOfLikes)
    }
    const saveLikeCount = async (amountOfLikes: number) => {
        await updateDoc(doc(db, 'post', userId, 'userPosts', postId), {
            "likesCount": amountOfLikes
        });
    }
    return (
        <TouchableOpacity disabled={isFetching}>
            {
                currentUserLike ?
                    <>
                        <AntDesign onPress={removeLikeHandle} name="heart" size={24} color="red"/>
                    </>
                    :
                    <>
                        <AntDesign onPress={setLikeHandle} name="hearto" size={24} color="black"/>
                    </>

            }
        </TouchableOpacity>
    )
}
export default LikeSystem
