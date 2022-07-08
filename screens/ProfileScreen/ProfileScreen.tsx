import {StyleSheet} from 'react-native';
import {View} from '../../components/Themed';
import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GetFollowingUsers, GetUserPosts, GetUserThunk, UserState} from "../../redux/reducers/user";
import {RootState} from "../../redux/store";
import Posts from "../Posts";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";
import {auth} from "../../firebase";
import {Feather} from '@expo/vector-icons';
import {useFocusEffect} from "@react-navigation/native";
import Profile from "./Profile";

type PropsType = {
    route: NativeStackScreenProps<RootTabParamList, 'Profile'>['route']
    navigation: NativeStackScreenProps<RootTabParamList, 'Profile'>['navigation']
}

const ProfileScreen: React.FC<PropsType> = ({navigation, route}) => {
    const dispatch = useDispatch<any>()
    const {user, isFetching, userPosts} = useSelector<RootState, UserState>(state => state.userState)
    useFocusEffect(
        useCallback(() => {
            if (route.params!.id) {
                const id = route.params!.id
                dispatch(GetUserThunk(id))
                dispatch(GetUserPosts(id))
                dispatch(GetFollowingUsers(id))
            } else {
                const id = auth.currentUser!.uid
                dispatch(GetUserThunk(id))
                dispatch(GetUserPosts(id))
                dispatch(GetFollowingUsers(id))
            }
        }, [route.params])
    )

    return (
        <View style={styles.container}>
            {
                (isFetching || !user) ?
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Feather name="loader" size={80} color="black"/>
                    </View>
                    :
                    <View style={{paddingTop: 20}}>
                        <Profile id={user.id} uri={user.uri} name={user.name}/>
                        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
                    </View>
            }
            {isFetching ?
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Feather name="loader" size={80} color="black"/>
                </View>
                :
                <Posts navigation={navigation} route={route}/>
            }
        </View>
    );
}
export default ProfileScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '100%',
    },
});
