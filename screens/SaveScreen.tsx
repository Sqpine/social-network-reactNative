import React, {useState} from 'react';
import {Button, Image, TextInput, View} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../types";
import {auth, db, storage} from "../firebase";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {addDoc, collection} from "firebase/firestore";
import firebase from "firebase/compat";

const SaveScreen = ({route, navigation}: NativeStackScreenProps<RootTabParamList, 'Save'>) => {
    const [caption, setCaption] = useState('')
    const [isUploading, setUploading] = useState(false)

    const textOnChange = (t: string) => {
        if (caption.length < 200 || t.length < 200) {
            setCaption(t)
        } else alert('Caption limit is 200 symbols')
    }

    const publishPost = async () => {
        if (!route.params) return
        setUploading(true)
        const uri = route.params.image
        const childPath = `posts/${auth.currentUser!.uid}/${Math.random().toString(36)}`
        const storageRef = ref(storage, childPath);

        const response = await fetch(uri)
        const blob = await response.blob()
        uploadBytes(storageRef, blob).then((snapshot) => {
            alert('Uploaded a blob or file!');
            getDownloadURL(snapshot.ref).then(downloadURL => savePostData(downloadURL))
        });
    }
    const savePostData = async (downloadURL: string) => {
        const uid = auth.currentUser!.uid
        console.log(downloadURL)
        debugger
        await addDoc(collection(db, 'post', uid, 'userPosts'), {
                downloadURL,
                caption,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            })
        alert('Uploaded a post');
        setUploading(false)
        navigation.navigate('Profile',{id:undefined})
    }

    return (
        <View>
            <View style={{
                display: 'flex',
                flexDirection: 'row',

                height: 'auto',
                paddingLeft: 20,
                paddingRight: 20,
                alignItems: 'flex-start'
            }}>
                <View style={{width: '70%', height: 'auto', marginTop: 10, paddingRight: 10}}>
                    <TextInput
                        multiline
                        value={caption}
                        onChangeText={text => textOnChange(text)}
                        placeholder='Write your caption . . .'
                    />
                </View>
                {
                    route.params &&
                    <Image style={{flex: 1, width: 100, height: 100, resizeMode: 'contain'}}
                           source={{uri: route.params.image}}/>
                }

            </View>
            <Button disabled={isUploading} onPress={() => publishPost()} title="Publish"/>
        </View>
    );
}


export default SaveScreen;