import * as ImagePicker from "expo-image-picker";
import React, {useState} from "react";
import {Camera, CameraType} from "expo-camera";
import {useIsFocused} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import {Text} from "../../components/Themed";

type PropsType = {
    setUri: (s: string) => void
    isDisabled: boolean
}
const ChangeAvatar: React.FC<PropsType> = ({setUri, isDisabled}) => {
    const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [camera, setCamera] = useState<Camera | null>(null);
    const [type, setType] = useState(CameraType.back);
    const isFocused = useIsFocused();

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
            setUri(pickerResult.uri)
        }
    }

    return (
        <TouchableOpacity disabled={isDisabled} onPress={() => pickImage()}>
            <Text style={{fontWeight: 'bold', color: '#3897F0'}}>
                Change Profile Photo
            </Text>
        </TouchableOpacity>
    )
}
export default ChangeAvatar