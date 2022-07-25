import {Image, StyleSheet, TouchableOpacity} from "react-native";
import {Text} from "../components/Themed";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {GetPostComments, UserState} from "../redux/reducers/user";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../types";
import {useNavigation} from "@react-navigation/native";

type PropsType = {
    route: NativeStackScreenProps<RootTabParamList, 'Post'>['route']
}
const CommentScreen: React.FC<PropsType> = ({route}) => {
    const navigation = useNavigation<NativeStackScreenProps<RootTabParamList, 'Comments'>['navigation']>()
    const dispatch = useDispatch<any>()
    const {userId, postId} = route.params
    const {isFetching, user, postComments} = useSelector<RootState, UserState>(state => state.userState)
    useEffect(() => {
        dispatch(GetPostComments({postId, userId}))
    }, [postId, userId])
    return (
        <>
            {postComments.map(comment => (
                <TouchableOpacity onPress={() => navigation.navigate('Profile', {id: comment.creator})}
                                  key={comment.postId} style={styles.commentContainer}>
                    <Image style={styles.avatarComment} source={require('../assets/images/noAvatar.png')}/>
                    <Text style={styles.comment}>{comment.text}</Text>
                </TouchableOpacity>
            ))}
        </>
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