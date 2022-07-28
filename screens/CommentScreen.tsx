import {Image, ScrollView, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import {Text} from "../components/Themed";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {GetPostComments, UserState} from "../redux/reducers/user";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../types";
import {useNavigation} from "@react-navigation/native";
import {collection, doc, setDoc} from "firebase/firestore";
import {auth, db} from "../firebase";

type PropsType = {
    route: NativeStackScreenProps<RootTabParamList, 'Post'>['route']
}
const CommentScreen: React.FC<PropsType> = ({route}) => {
    const uid = auth.currentUser!.uid
    const navigation = useNavigation<NativeStackScreenProps<RootTabParamList, 'Comments'>['navigation']>()
    const dispatch = useDispatch<any>()
    const {userId, postId} = route.params
    const {isFetching, user, postComments} = useSelector<RootState, UserState>(state => state.userState)
    const [comment, setComment] = useState('')

    useEffect(() => {
        dispatch(GetPostComments({postId, userId}))
    }, [postId, userId])

    const leaveComment = async () => {
        if (!comment.trim() && comment.length > 180) return
        await setDoc(doc(collection(db, 'post', userId, 'userPosts', postId, 'comments')), {
            creator: uid,
            text: comment
        })
        setComment('')
        navigation.navigate('Comments', {postId, userId})
    }

    return (
        <ScrollView contentContainerStyle={{flex:1}} style={{backgroundColor:'white'}}>
            {postComments.map(comment => (
                <TouchableOpacity onPress={() => navigation.navigate('Profile', {id: comment.creator})}
                                  key={comment.postId} style={styles.commentContainer}>
                    <Image style={styles.avatarComment} source={require('../assets/images/noAvatar.png')}/>
                    <Text style={styles.comment}>{comment.text}</Text>
                </TouchableOpacity>
            ))}
            <TextInput
                value={comment}
                onChangeText={(t) => setComment(t)}
                onSubmitEditing={leaveComment}
                placeholder="Comment . . ."
            />
        </ScrollView>
    )
}
export default CommentScreen;
const styles = StyleSheet.create({
    commentContainer: {
        width: '90%',
        flexDirection: "row",
        alignItems: 'center'
    },
    avatarComment: {
        marginVertical: 5,
        borderRadius: 100,
        width: 20,
        height: 20,
    },
    comment: {
        marginHorizontal: 3
    },
});