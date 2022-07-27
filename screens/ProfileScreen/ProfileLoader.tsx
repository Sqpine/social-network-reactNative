import {View} from "../../components/Themed";
import React from "react";
import {StyleSheet} from "react-native";

const ProfileLoader = () => {
    return (
        <View style={{paddingTop: 20}}>
            <View style={{paddingHorizontal: 20}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View>
                        <View style={styles.avatarSkeleton}></View>
                        <View style={styles.nameSkeleton}></View>
                    </View>
                    <View
                        style={styles.infoContainer}>
                        <View style={{alignItems: 'center'}}>
                            <View style={styles.shorLine}></View>
                            <View style={styles.shorLine}></View>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <View style={styles.shorLine}></View>
                            <View style={styles.shorLine}></View>
                        </View>
                        <View style={{alignItems: 'center'}}>
                            <View style={styles.shorLine}></View>
                            <View style={styles.shorLine}></View>
                        </View>
                    </View>
                </View>
                <View>
                </View>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
        </View>
    )
}
export default ProfileLoader

const styles = StyleSheet.create({
    avatarSkeleton: {
        overflow: 'hidden', width: 100, height: 100, borderRadius: 100, backgroundColor: 'gray'
    },
    nameSkeleton: {
        marginVertical: 10, width: 100, height: 15, backgroundColor: 'gray'
    },
    infoContainer: {
        width: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    shorLine: {
        marginVertical: 10, width: 40, height: 15, backgroundColor: 'gray'
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '100%',
    }
})