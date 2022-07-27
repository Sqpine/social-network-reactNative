import {ScrollView, StyleSheet} from 'react-native';
import {View} from '../../components/Themed';
import React, {useCallback, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GetFollowingUsers, GetUserPosts, GetUserThunk, UserState} from "../../redux/reducers/user";
import {RootState} from "../../redux/store";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";
import {auth} from "../../firebase";
import {useFocusEffect} from "@react-navigation/native";
import Profile from "./Profile";
import Posts from "../PostScreen/Posts";
import ProfileLoader from "./ProfileLoader";
import Loader from "../../components/Loader";

type PropsType = {
    route: NativeStackScreenProps<RootTabParamList, 'Profile'>['route']
    navigation: NativeStackScreenProps<RootTabParamList, 'Profile'>['navigation']
}

export type PositionType = {
    x: number
    y: number
}

const ProfileScreen: React.FC<PropsType> = ({navigation, route}) => {
    const dispatch = useDispatch<any>()
    const {user, isFetching, userPosts} = useSelector<RootState, UserState>(state => state.userState)
    const [position, setPosition] = useState<PositionType>({x: 0, y: 0})
    const scrollViewRef = useRef<ScrollView>(null)
    useFocusEffect(
        useCallback(() => {
            let id
            if (route.params!.id) {
                id = route.params!.id
            } else id = auth.currentUser!.uid
            dispatch(GetUserThunk(id))
            dispatch(GetUserPosts(id))
            dispatch(GetFollowingUsers(id))
        }, [route.params])
    )
    const userPostsCount = userPosts?.length || 0

    return (
        <ScrollView
            style={{backgroundColor: 'white'}}
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
        >
            {
                isFetching ?
                    <ProfileLoader/>
                    :
                    user &&
                    <View style={{paddingTop: 20}}>
                        <Profile
                            position={position}
                            scrollViewRef={scrollViewRef}
                            id={user.id}
                            uri={user.uri}
                            name={user.name}
                            userPostsCount={userPostsCount}
                        />
                        <View onLayout={(event) => {
                            const {x, y} = event.nativeEvent.layout;
                            setPosition({x, y})
                        }
                        } style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
                    </View>
            }
            {
                isFetching ?
                    <Loader color="#0000ff" size="large"/>
                    :
                    <Posts navigation={navigation} route={route}/>
            }
        </ScrollView>
    );
}
export default ProfileScreen
const styles = StyleSheet.create({
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginTop: 30,
        marginBottom: 20,
        height: 1,
        width: '100%',
    },
});
