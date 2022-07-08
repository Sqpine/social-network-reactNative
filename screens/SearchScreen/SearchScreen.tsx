import {View} from "../../components/Themed";
import {ScrollView, StyleSheet, TextInput} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import * as React from "react";
import {useMemo, useState} from "react";
import useColorScheme from "../../hooks/useColorScheme";
import {collection, doc, getDocs, limit, orderBy, query, setDoc, where} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {UserType} from "../../redux/reducers/user";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";
import {useFocusEffect} from "@react-navigation/native";
import User from "./User";


const SearchScreen = () => {
    const [users, setUsers] = useState<UserType[]>([])
    const [userName, setUserName] = useState('')
    const uid = auth.currentUser!.uid
    const colorScheme = useColorScheme();
    useFocusEffect(
        React.useCallback(() => {
            getAllUsers()
        }, [])
    );
    const getAllUsers = async () => {
        const q = query(collection(db, 'users'), orderBy("name", "desc"), limit(20));
        await getDoc(q)
    }

    const searchSubmit = async () => {
        if (!userName) return
        const q = query(
            collection(db, 'users'),
            where('name', '>=', userName),
            where('name', '<=', userName + '\uf8ff')
        );
        await getDoc(q)
    }
    const getDoc = async (q: any) => {
        const querySnapshot = await getDocs(q)
        let response: UserType[] = []
        await querySnapshot.forEach((doc) => {
            if (doc.id === uid) return
            const userData = doc.data() as UserType
            response = [...response, {...userData,id: doc.id}]
        });
        setUsers(response)
    }
    const usersList = useMemo(() => users.map(({id, name,uri, email}) =>
        <User key={id} id={id} name={name} email={email}  uri={uri}/>)
        , [users]
    )
    return (
        <ScrollView stickyHeaderIndices={[0]}
                    showsVerticalScrollIndicator={false}
        >
            <View style={styles.header}>
                <View style={styles.inputField}>
                    <AntDesign style={styles.search} name="search1" size={24} color={'rgba(60, 60, 67, 0.6)'}/>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={userName}
                            onChangeText={(t) => setUserName(t)}
                            onSubmitEditing={searchSubmit}
                            style={styles.input} autoFocus={true}/>
                    </View>
                </View>
            </View>
            {usersList}
        </ScrollView>
    )
}
export default SearchScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        // paddingVertical: 3,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
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
    avatar: {
        width: 30,
        height: '100%'
    },
    user: {
        flexDirection: 'row'
    },
    userInfo: {
        marginHorizontal: 10
    },
    userContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    }
});