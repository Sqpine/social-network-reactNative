import React from 'react';
import {View} from "../../components/Themed";
import {Image, TouchableHighlight} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";

type PropsType = {
    id: string
    url: string
    caption: string
    userId: string | null
    likesCount: number
    navigation: NativeStackScreenProps<RootTabParamList, 'Profile'>['navigation']
}
const Post: React.FC<PropsType> = ({url, caption, likesCount, userId, id, navigation}) => {

    const openPost = () => {
        if (!userId) return
        navigation.navigate('Post', {image: url, caption, likesCount, postId: id, userId})
    }
    return (
        <TouchableHighlight onPress={openPost} underlayColor="white">
            <View style={{
                width: 100, height: 100, margin: 4, backgroundColor: '#2234'
            }}>
                <Image style={{width: 100, height: 100}} source={{uri: url}}/>
            </View>
        </TouchableHighlight>
    );
};

export default Post;