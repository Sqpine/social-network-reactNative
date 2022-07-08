import React, {useEffect, useState} from "react";
import {Camera, CameraType} from "expo-camera";
import {useIsFocused} from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import {Button, Image, StyleSheet, View} from "react-native";
import {Text} from "../components/Themed";

type PropsType = {
    setImage: (s: string) => void
    image: string | null
}
const CameraPhone: React.FC<PropsType> = ({setImage, image}) => {
    const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [camera, setCamera] = useState<Camera | null>(null);
    const [type, setType] = useState(CameraType.back);
    const isFocused = useIsFocused();

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync()
            setImage(data.uri)
        }
    }
    const pickImage = async () => {
        if (hasGalleryPermission) {
            let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(permissionResult === 'granted');
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!pickerResult.cancelled) {
            setImage(pickerResult.uri)
        }
    }
    if (hasCameraPermission === null) {
        return <View/>;
    }
    if (!hasCameraPermission) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            {isFocused
                &&
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.camera} type={type} ratio={'1:1'}/>
            }
            <Button title="Flip Image" onPress={
                () => setType(type === CameraType.back ? CameraType.front : CameraType.back)}/>
            <Button title="Take Picture" onPress={
                () => takePicture()}/>
            <Button title="Pick Picture" onPress={
                () => pickImage()}/>
            {image && <Image source={{uri: image}} style={{flex: 1}}/>}
        </View>
    );
}
export default CameraPhone
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
