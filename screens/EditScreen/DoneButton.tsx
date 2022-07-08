import {Text} from "../../components/Themed";
import {StyleSheet, TouchableOpacity} from "react-native";
import * as React from "react";
import {useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {doc, updateDoc} from "firebase/firestore";
import {auth, db, storage} from "../../firebase";
import {useNavigation} from "@react-navigation/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";
import {EditInfoType, UserType} from "../../redux/reducers/user";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

const DoneButton = () => {
    const [isFetching, setIsFetching] = useState(false)
    const navigation = useNavigation<NativeStackScreenProps<RootTabParamList, 'EditProfile'>['navigation']>()
    const {name, bio, uri} = useSelector<RootState, EditInfoType>(state => state.userState.editInfo)
    const currentUserInfo = useSelector<RootState, UserType | null>(state => state.userState.user)
    const updateInfo = async () => {
        setIsFetching(true)
        await updateDoc(doc(db, "users", auth.currentUser!.uid), {
            name,
            bio
        });
        await publishPost()
        navigation.navigate('Profile', {id: undefined})
        setIsFetching(false)
    }

    const publishPost = async () => {
        const uid = auth.currentUser!.uid
        if (!uri && uri !== currentUserInfo!.uri) return
        const childPath = `avatars/${uid}/${Math.random().toString(36)}`
        const storageRef = ref(storage, childPath);

        const response = await fetch(uri)
        const blob = await response.blob()
        const snapshot = await uploadBytes(storageRef, blob)
        const downloadURL = await getDownloadURL(snapshot.ref)
        await updateDoc(doc(db, "users", uid), {uri: downloadURL})
        alert('Uploaded a post');
        return
    }

    return (
        <TouchableOpacity disabled={isFetching} onPress={() => updateInfo()}>
            <Text style={isFetching ? styles.unActive : styles.active}>
                Done
            </Text>
        </TouchableOpacity>
    )
}
export default DoneButton
const styles = StyleSheet.create({
    active: {
        fontWeight: 'bold',
        color: '#3897F0'
    },
    unActive: {
        fontWeight: 'bold',
        color: '#464646'
    },
});