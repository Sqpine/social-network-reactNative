import React, {useCallback, useState} from "react";
import {View,Text} from "../../components/Themed";
import {NativeSyntheticEvent, StyleSheet, TextLayoutEventData} from "react-native";

type PropsType = {
    caption: string
    name:string
}
const Caption: React.FC<PropsType> = ({caption,name}) => {
    const [textShown, setTextShown] = useState(false)
    const [lengthMore, setLengthMore] = useState(false)
    const toggleNumberOfLines = () => {
        setTextShown(prevState => !prevState);
    }

    const onTextLayout = useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
        setLengthMore(e.nativeEvent.lines.length >= 4)
    }, []);

    return (
        <View style={styles.footer}>
            <Text style={styles.nameText}>{name}</Text>
            <Text
                onTextLayout={onTextLayout}
                numberOfLines={textShown ? undefined : 4}
                style={{lineHeight: 21}}
            >
                {caption}
            </Text>

            {
                lengthMore ?
                    <Text
                        style={styles.followText}
                        onPress={toggleNumberOfLines}
                    >
                        {textShown ? 'Read less...' : 'Read more...'}
                    </Text>
                    : null
            }
        </View>
    )
}
export default Caption
const styles = StyleSheet.create({
    footer: {
        paddingVertical: 10,
    },
    nameText: {
        fontWeight: "bold",
        color: "#20232a",
    },
    followText: {
        fontWeight: "bold",
        color: "#0095f6",
    },
})