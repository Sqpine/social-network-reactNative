import React, {useState} from "react";
import {Dimensions, Image, StyleSheet} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../types";
import {AntDesign} from '@expo/vector-icons';
import {Text, View} from '../components/Themed';
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {UserState} from "../redux/reducers/user";

type PropsType = {
    route: NativeStackScreenProps<RootTabParamList, 'Post'>['route']
}
const PostScreen: React.FC<PropsType> = ({route}) => {
    const [isLiked, setLike] = useState(false)
    const [isReadMore, setReadMore] = useState(false)
    const {isFetching, user} = useSelector<RootState, UserState>(state => state.userState)
    const like = () => {

    }
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.profile}>
                        <Image style={styles.avatar} resizeMode="cover"
                               source={require('../assets/images/noAvatar.png')}/>
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
                    {isReadMore ?
                        <>
                            <Text>{route.params.caption}</Text>
                            <Text style={styles.followText} onPress={()=>setReadMore(false)}>Read Less</Text>
                        </>
                        :
                        <>
                            <Text numberOfLines={3}>{route.params.caption}</Text>
                            <Text style={styles.followText} onPress={()=>setReadMore(true)}>Read More</Text>
                        </>
                    }
                </View>
                <View style={styles.footerLike}>
                    {
                        isLiked ?
                            <AntDesign name="heart" size={24} color="red"/>
                            :
                            <AntDesign name="hearto" size={24} color="black"/>

                    }
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
        width: screen.width * 0.1,
        height: screen.width * 0.1,
    },
    image: {
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