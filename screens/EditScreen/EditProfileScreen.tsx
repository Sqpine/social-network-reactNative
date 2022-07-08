import React, {useEffect, useState} from "react";
import {Text, View} from "../../components/Themed";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {EditInfoType, setAvatar, setEditBio, setEditName} from "../../redux/reducers/user";
import {Image, StyleSheet, TextInput} from "react-native";
import ChangeAvatar from "./ChangeAvatar";

const EditProfileScreen = () => {
    const {name, bio, uri} = useSelector<RootState, EditInfoType>(state => state.userState.editInfo)
    const [image, setImage] = useState<string | null>(uri);
    const dispatch = useDispatch<any>()
    useEffect(() => {
        if (uri) {
            dispatch(setAvatar(uri))
        }
    }, [uri])
    return (
        <View style={styles.container}>
            <View style={{alignItems: 'center'}}>
                <Image style={{marginVertical: 20, width: 100, height: 100, borderRadius: 100}}
                       source={image ? ({uri: image}) : require('../../assets/images/noAvatar.png')}/>
                <ChangeAvatar setUri={setImage}/>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{width: '30%'}}>
                    Name
                </Text>
                <View style={styles.textInput}>
                    <TextInput style={{flex: 1}} value={name} onChangeText={(t) => dispatch(setEditName(t))}/>
                </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 20}}>
                <Text style={{width: '30%'}}>
                    Bio
                </Text>
                <View style={styles.textInput}>
                    <TextInput style={{flex: 1}} value={bio} onChangeText={(t) => dispatch(setEditBio(t))}/>
                </View>
            </View>
        </View>
    )
}
export default EditProfileScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems:'center',
        paddingHorizontal: 15,
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '100%',
    },
    textInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#C6C6C9'
    }
});
