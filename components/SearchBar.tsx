import {View} from "./Themed";
import {AntDesign} from "@expo/vector-icons";
import {StyleSheet, TextInput} from "react-native";
import * as React from "react";

type PropsType = {
    userName: string
    searchSubmit: () => void
    setUserName: (t: string) => void
    isFocus: boolean
    placeHolder: string
}
const SearchBar: React.FC<PropsType> = (
    {
        userName,
        placeHolder,
        isFocus,
        setUserName,
        searchSubmit
    }
) => {
    return (
        <View style={styles.header}>
            <View style={styles.inputField}>
                <AntDesign style={styles.search} name="search1" size={24} color={'rgba(60, 60, 67, 0.6)'}/>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder={placeHolder}
                        value={userName}
                        onChangeText={(t) => setUserName(t)}
                        onSubmitEditing={searchSubmit}
                        style={styles.input}
                        autoFocus={isFocus}/>
                </View>
            </View>
        </View>
    )
}
export default SearchBar

const styles = StyleSheet.create({
    inputField: {
        backgroundColor: 'rgba(118, 118, 128, 0.12)',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
        borderRadius: 10,
    },
    inputContainer: {
        maxWidth: '85%',
        minWidth: '80%',
        width: 'auto',
    },
    header: {
        backgroundColor: 'white',
    },
    input: {
        color: 'rgba(60, 60, 67, 0.6)',
        height: 40,
        backgroundColor: 'rgba(118, 118, 128, 0.12)'
    },
    search: {
        marginHorizontal: 10,
        // width:'10%',
    },
});