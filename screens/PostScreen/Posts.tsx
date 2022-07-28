import React from 'react';
import {View} from "../../components/Themed";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {UserState} from "../../redux/reducers/user";
import Post from "./Post";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";

type PropsType = {
    route: NativeStackScreenProps<RootTabParamList, 'Profile'>['route']
    navigation: NativeStackScreenProps<RootTabParamList, 'Profile'>['navigation']
}
const Posts: React.FC<PropsType> = ({navigation, route}) => {
    const dispatch = useDispatch<any>()
    const {isFetching, userPosts, user} = useSelector<RootState, UserState>(state => state.userState)


    return (
        <View style={{
            width: 325,
            flexWrap:'wrap',
            flexDirection:'row',
            marginRight:'auto',
            marginLeft:'auto',
        }}
        >
            {userPosts?.map(
                ({id, downloadURL, caption, likesCount}) =>
                    <Post
                        key={id}
                        id={id}
                        navigation={navigation}
                        name={user && user.name}
                        likesCount={likesCount}
                        userId={user && user.id}
                        url={downloadURL}
                        caption={caption}
                    />
            )}
        </View>
    );
};

export default Posts;