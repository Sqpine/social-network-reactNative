import React, {useEffect, useState} from 'react';
import {Button, Image, StyleSheet, View} from 'react-native';
import {RootTabParamList} from "../types";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useIsFocused} from "@react-navigation/native";
import CameraPhone from "./CameraPhone";

// const PhotoScreen = ({navigation}: NativeStackScreenProps<RootTabParamList, 'CreatePost'>) => {
//     const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);
//     const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
//     const [camera, setCamera] = useState<CameraPhone | null>(null);
//     const [image, setImage] = useState<null | string>(null);
//     const [type, setType] = useState(CameraType.back);
//     const isFocused = useIsFocused();
//
//     useEffect(() => {
//         (async () => {
//             const {status} = await CameraPhone.requestCameraPermissionsAsync();
//             setHasCameraPermission(status === 'granted');
//         })();
//     }, []);
//
//     useEffect(() => {
//         if (image) {
//             navigation.navigate('Save', {image: image})
//         }
//     }, [image])
//
//     const takePicture = async () => {
//         if (camera) {
//             const data = await camera.takePictureAsync()
//             setImage(data.uri)
//         }
//     }
//     const pickImage = async () => {
//         if (hasGalleryPermission) {
//             let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//             setHasGalleryPermission(permissionResult === 'granted');
//         }
//
//         let pickerResult = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//         });
//
//         if (!pickerResult.cancelled) {
//             setImage(pickerResult.uri)
//         }
//     }
//     if (hasCameraPermission === null) {
//         return <View/>;
//     }
//     if (!hasCameraPermission) {
//         return <Text>No access to camera</Text>;
//     }
//     return (
//         <View style={styles.container}>
//             {isFocused
//                 &&
//                 <CameraPhone
//                     ref={ref => setCamera(ref)}
//                     style={styles.camera} type={type} ratio={'1:1'}/>
//             }
//             <Button title="Flip Image" onPress={
//                 () => setType(type === CameraType.back ? CameraType.front : CameraType.back)}/>
//             <Button title="Take Picture" onPress={
//                 () => takePicture()}/>
//             <Button title="Pick Picture" onPress={
//                 () => pickImage()}/>
//             {image && <Image source={{uri: image}} style={{flex: 1}}/>}
//         </View>
//     );
// }
const PhotoScreen = ({navigation}: NativeStackScreenProps<RootTabParamList, 'CreatePost'>) => {
    const [image, setImage] = useState<null | string>(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (image) {
            navigation.navigate('Save', {image: image})
        }
    }, [image])

    return (
        <CameraPhone setImage={setImage} image={image} />
    );
}
export default PhotoScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    camera: {
        flex: 1,
        aspectRatio: 1
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        margin: 20,
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
});