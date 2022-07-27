import React, {useState} from "react";
import {Dimensions, Image, StyleSheet, TextInput, TouchableOpacity} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";
import {Text, View} from '../../components/Themed';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {UserState} from "../../redux/reducers/user";
import {collection, doc, setDoc} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {useNavigation} from "@react-navigation/native";
import LikeSystem from "../LikeSystem";

type PropsType = {
    route: NativeStackScreenProps<RootTabParamList, 'Post'>['route']
}
const PostScreen: React.FC<PropsType> = ({route}) => {
    const navigation = useNavigation<NativeStackScreenProps<RootTabParamList, 'Post'>['navigation']>()
    const uid = auth.currentUser!.uid
    const {postId, userId,likesCount} = route.params
    const [comment, setComment] = useState('')
    const [isReadMore, setReadMore] = useState(false)
    const {user} = useSelector<RootState, UserState>(state => state.userState)
    const leaveComment = async () => {
        if (!comment.trim() && comment.length > 180) return
        debugger
        await setDoc(doc(collection(db, 'post', userId, 'userPosts', postId, 'comments')), {
            creator: uid,
            text: comment
        })
        debugger
        setComment('')
        navigation.navigate('Comments', {postId, userId})
    }
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.profile}>
                        <Image style={styles.avatar} resizeMode="cover"
                               source={require('../../assets/images/noAvatar.png')}/>
                        <Text style={styles.nameText}>{user!.name}</Text>
                    </View>
                    <Text style={styles.followText}>Follow</Text>
                </View>
                {route.params &&
                    <Image style={styles.image}
                           resizeMode="cover" source={{uri: route.params.image}}/>

                }
                <View style={styles.footer}>
                    <Text style={styles.nameText}>{user!.name}</Text>
                    {/*{isReadMore ?*/}
                    {/*    <>*/}
                    {/*        <Text>{route.params.caption}</Text>*/}
                    {/*        <Text style={styles.followText} onPress={() => setReadMore(false)}>Read Less</Text>*/}
                    {/*    </>*/}
                    {/*    :*/}
                    {/*    <>*/}
                    {/*        <Text numberOfLines={3}>{route.params.caption}</Text>*/}
                    {/*        <Text style={styles.followText} onPress={() => setReadMore(true)}>Read More</Text>*/}
                    {/*    </>*/}
                    {/*}*/}
                </View>
                <LikeSystem likesCount={likesCount} postId={postId} userId={userId}/>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Comments', {postId, userId})}
                >
                    <Text>
                        Comment Screen
                    </Text>
                </TouchableOpacity>
                <View>
                    <TextInput value={comment}
                               onChangeText={(t) => setComment(t)}
                               onSubmitEditing={leaveComment}
                               placeholder="Comment . . ."
                    />
                </View>
            </View>
        </View>
    )

}
export default PostScreen

const screen = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
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
    footer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    footerLike: {
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    nameText: {
        paddingHorizontal: 5,
        fontWeight: "bold",
        color: "#20232a",
    },
    followText: {
        fontWeight: "bold",
        color: "#0095f6",
    },
});