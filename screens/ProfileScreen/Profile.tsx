import {Text, View} from "../../components/Themed";
import {Image, TouchableOpacity} from "react-native";
import React, {useState} from "react";
import {signOut} from "firebase/auth";
import {auth} from "../../firebase";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";
import FollowUnFollow from "./FollowUnFollow";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";

type PropsType = {
    uri: string
    name: string
    id: string
}
const Profile: React.FC<PropsType> = ({uri, name, id}) => {
    const [isSigningOut, SigningOut] = useState(false)
    const followedUsers = useSelector<RootState, string[]>(state => state.userState.followedUsers)
    const navigation = useNavigation<NativeStackScreenProps<RootTabParamList, 'Profile'>['navigation']>()
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
    return (
        <View style={{paddingHorizontal: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                    <Image style={{overflow: 'hidden', width: 100, height: 100, borderRadius: 100}}
                           source={uri ? ({uri}) : require('../../assets/images/noAvatar.png')}/>
                    <Text style={{fontWeight: 'bold', marginVertical: 10}}>{name}</Text>
                </TouchableOpacity>
                <View
                    style={{width: '60%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontWeight: 'bold'}}>
                            54
                        </Text>
                        <Text>
                            Posts
                        </Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontWeight: 'bold'}}>
                            834
                        </Text>
                        <Text>
                            Followers
                        </Text>
                    </View>
                    <TouchableOpacity style={{alignItems: 'center'}} onPress={() => navigation.navigate('Following')}>
                        <Text style={{fontWeight: 'bold'}}>
                            {followedUsers.length}
                        </Text>
                        <Text>
                            Following
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View>
                {/*<Button disabled={isSigningOut} title="Sign Out" onPress={() => SignOut()}/>*/}
                {id === auth.currentUser!.uid ?
                    <TouchableOpacity style={{
                        marginTop: 15,
                        borderRadius: 5,
                        paddingVertical: 5,
                        alignItems: 'center',
                        borderColor: 'rgba(60, 60, 67, 0.18)',
                        borderWidth: 1,
                    }} onPress={() => navigation.navigate('EditProfile')}>
                        <Text style={{
                            fontWeight: 'bold',
                        }}>
                            Edit Profile
                        </Text>
                    </TouchableOpacity>
                    :
                    <FollowUnFollow id={id}/>
                }
            </View>
        </View>
    )
}
export default Profile
