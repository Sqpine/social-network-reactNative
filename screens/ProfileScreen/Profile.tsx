import {Text, View} from "../../components/Themed";
import {Button, Image, ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import React, {RefObject, useState} from "react";
import {signOut} from "firebase/auth";
import {auth} from "../../firebase";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";
import FollowUnFollow from "./FollowUnFollow";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {PositionType} from "./ProfileScreen";

type PropsType = {
    uri: string
    name: string
    id: string
    bio: string
    userPostsCount: number
    scrollViewRef: RefObject<ScrollView>
    position: PositionType
}
const Profile: React.FC<PropsType> = (
    {
        uri,
        position,
        scrollViewRef,
        userPostsCount,
        name,
        id,
        bio
    }
) => {
    const [isSigningOut, SigningOut] = useState(false)
    const followedUsers = useSelector<RootState, string[]>(state => state.userState.followedUsers)
    const navigation = useNavigation<NativeStackScreenProps<RootTabParamList, 'Profile'>['navigation']>()

    const isOwnPage = id === auth.currentUser!.uid
    const SignOut = async () => {
        SigningOut(true);
        try {
            await signOut(auth)
            alert('Sign-out successful.')

        } catch (e) {
            const errorMessage = e.message;
            if (errorMessage) {
                alert(e.message)
            }
        }
        SigningOut(false);
    }

    const scrollTo = () => {
        scrollViewRef.current?.scrollTo({
                x: position.x,
                y: position.y,
                animated: true,
            }
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileInfo}>
                <TouchableOpacity disabled={!isOwnPage} onPress={() => navigation.navigate('EditProfile')}>
                    <Image style={styles.avatar}
                           source={uri ? ({uri}) : require('../../assets/images/noAvatar.png')}/>
                    <Text style={styles.name}>{name}</Text>
                </TouchableOpacity>
                <View style={styles.infoContainer}>
                    <TouchableOpacity
                        onPress={() => scrollTo()}
                        style={styles.infoSection}
                    >
                        <Text style={styles.bolder}>
                            {userPostsCount}
                        </Text>
                        <Text>
                            Posts
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.infoSection}
                        onPress={() => navigation.navigate('Following')}
                    >
                        <Text style={styles.bolder}>
                            {followedUsers.length}
                        </Text>
                        <Text>
                            Following
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {bio ?
                <Text>
                    {bio}
                </Text>
                :
                null
            }
            {isOwnPage ?
                <View>
                    <TouchableOpacity style={styles.editProfile} onPress={() => navigation.navigate('EditProfile')}>
                        <Text style={styles.bolder}>
                            Edit Profile
                        </Text>
                    </TouchableOpacity>
                    <Button disabled={isSigningOut} title="Sign Out" onPress={() => SignOut()}/>
                </View>
                :
                <FollowUnFollow id={id}/>
            }
        </View>
    )
}
export default Profile

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20
    },
    profileInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    infoContainer: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    infoSection: {
        alignItems: 'center'
    },
    avatar: {
        overflow: 'hidden',
        width: 100,
        height: 100,
        borderRadius: 100
    },
    name: {
        fontWeight: 'bold',
        marginVertical: 10
    },
    bolder: {
        fontWeight: 'bold'
    },
    editProfile: {
        marginVertical: 15,
        borderRadius: 5,
        paddingVertical: 5,
        alignItems: 'center',
        borderColor: 'rgba(60, 60, 67, 0.18)',
        borderWidth: 1,
    }
})
