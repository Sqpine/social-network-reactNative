import React, {useEffect, useState} from "react";
import {Dimensions, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";
import {Text, View} from '../../components/Themed';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {UserState} from "../../redux/reducers/user";
import {collection, doc, onSnapshot, setDoc} from "firebase/firestore";
import {auth, db} from "../../firebase";
import LikeSystem from "../LikeSystem";
import FollowUnFollow from "../ProfileScreen/FollowUnFollow";
import {FontAwesome5} from '@expo/vector-icons';
import Caption from "./Caption";

type PropsType = {
    route: NativeStackScreenProps<RootTabParamList, 'Post'>['route']
    navigation: NativeStackScreenProps<RootTabParamList, 'Post'>['navigation']
}
const PostScreen: React.FC<PropsType> = ({route, navigation}) => {
    const uid = auth.currentUser!.uid
    const {
        postId,
        userId,
        caption,
        likesCount,
        image,
        name
    } = route.params

    const {user} = useSelector<RootState, UserState>(state => state.userState)

    const [comment, setComment] = useState('')
    const [isReadMore, setReadMore] = useState(false)
    const [currentUserLike, setCurrentUserLike] = useState(false)
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
        <View style={styles.container}>
            <ScrollView style={styles.card}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Profile', {id: userId})}
                        style={styles.profile}
                    >
                        <Image style={styles.avatar} resizeMode="cover"
                               source={
                                   user ?
                                       {uri: user.uri}
                                       :
                                       require('../../assets/images/noAvatar.png')
                               }
                        />
                        <Text style={styles.nameText}>{user!.name}</Text>
                    </TouchableOpacity>
                    {userId !== uid
                        &&
                        <FollowUnFollow id={userId}/>
                    }
                </View>
                <Image style={styles.image}
                       resizeMode="cover" source={{uri: image}}/>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 5,
                }}>
                    <LikeSystem
                        likesCount={amountOfLikes}
                        postId={postId}
                        userId={userId}
                        currentUserLike={currentUserLike}
                        setLikesCount={setAmountOfLikes}
                    />
                    <TouchableOpacity
                        style={{marginHorizontal: 25,}}
                        onPress={() => navigation.navigate('Comments', {postId, userId})}
                    >
                        <FontAwesome5 name="comment" size={24} color="black"/>
                    </TouchableOpacity>
                </View>
                {amountOfLikes > 0 ?
                    <Text>
                        Liked {amountOfLikes}
                    </Text>
                    :
                    <Text>
                        You can like it first
                    </Text>
                }
                {caption ? <Caption caption={caption} name={name}/> : null}
                <TextInput
                    value={comment}
                    onChangeText={(t) => setComment(t)}
                    onSubmitEditing={leaveComment}
                    placeholder="Comment . . ."
                />
            </ScrollView>
        </View>
    )

}
export default PostScreen

const screen = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    card: {
        backgroundColor: "#fff",
        width: screen.width * 0.9,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',
        paddingHorizontal: 7,
        paddingVertical: 10,
    },
    nameText: {
        paddingHorizontal: 5,
        fontWeight: "bold",
        color: "#20232a",
    },
    profile: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center'
    },
    avatar: {
        borderRadius: 100,
        width: 35,
        height: 35,
    },
    image: {
        maxHeight: 500,
        height: screen.width * 0.8,
    },
});