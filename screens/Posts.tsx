import React, {useEffect} from 'react';
import {View} from "../components/Themed";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {GetUserPosts, UserState} from "../redux/reducers/user";
import Post from "./Post";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../types";
import {auth} from "../firebase";

type PropsType = {
    route: NativeStackScreenProps<RootTabParamList, 'Profile'>['route']
    navigation: NativeStackScreenProps<RootTabParamList, 'Profile'>['navigation']
}
const Posts: React.FC<PropsType> = ({navigation, route}) => {
    const dispatch = useDispatch<any>()
    const {isFetching, userPosts, user} = useSelector<RootState, UserState>(state => state.userState)


    return (
        <View style={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: 'row',
            marginHorizontal: 'auto',
            flex: 3
        }}>
            {userPosts?.map(
                ({id, downloadURL, caption}) =>
                    <Post navigation={navigation} key={id} id={id} url={downloadURL} caption={caption}/>
            )}
        </View>
    );
};

export default Posts;