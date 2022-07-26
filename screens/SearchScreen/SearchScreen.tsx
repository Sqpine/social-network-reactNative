import {ScrollView, StyleSheet} from "react-native";
import * as React from "react";
import {useCallback, useMemo, useState} from "react";
import useColorScheme from "../../hooks/useColorScheme";
import {collection, getDocs, limit, orderBy, query, where} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {UserType} from "../../redux/reducers/user";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import User from "./User";
import SearchBar from "../../components/SearchBar";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootTabParamList} from "../../types";
import Loader from "../../components/Loader";
import InfoUser from "./InfoUser";
import {View} from "../../components/Themed";

const SearchScreen = () => {
    const navigation = useNavigation<NativeStackScreenProps<RootTabParamList, 'Search'>['navigation']>()
    const [users, setUsers] = useState<UserType[]>([])
    const [userName, setUserName] = useState('')
    const [isFetching, setFetching] = useState(true)
    const uid = auth.currentUser!.uid
    const colorScheme = useColorScheme();

    useFocusEffect(useCallback(() => {
        if (!userName.trim()) getAllUsers()
        else searchSubmit()
        return ()=>{
            setUsers([])
        }
    }, []));

    const getAllUsers = async () => {
        const q = query(collection(db, 'users'), orderBy("name", "desc"), limit(20));
        setFetching(true)
        await getDoc(q)
        setFetching(false)
    }

    const searchSubmit = async () => {
        if (!userName.trim()) {
            getAllUsers()
            return
        }

        const q = query(
            collection(db, 'users'),
            where('name', '>=', userName),
            where('name', '<=', userName + '\uf8ff')
        );

        setFetching(true)
        await getDoc(q)
        setFetching(false)
    }
    const getDoc = async (q: any) => {
        const querySnapshot = await getDocs(q)
        let response: UserType[] = []
        await querySnapshot.forEach((doc) => {
            if (doc.id === uid) return
            const userData = doc.data() as UserType
            response = [...response, {...userData, id: doc.id}]
        });
        setUsers(response)
    }
    const onPressHandler = useCallback((id: string) => navigation.navigate('Profile', {id}), [])
    const usersList = useMemo(() => users.map(({id, name, uri, email}) =>
            <User
                key={id}
                id={id}
                name={name}
                email={email}
                uri={uri}
                onPressHandler={onPressHandler}
                showFollow={true}
            />
        )
        , [users]
    )
    return (
        <View style={styles.container}>
            <SearchBar
                placeHolder={'Search'}
                isFocus={true}
                searchSubmit={searchSubmit}
                setUserName={setUserName}
                userName={userName}
            />
            {isFetching ?
                <Loader color="#0000ff" size="large"/>
                :
                usersList.length > 0 ?
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {
                            usersList
                        }
                    </ScrollView>
                    :
                    <InfoUser text="No similar users found" ico="users-slash"/>
            }
        </View>
    )
}
export default SearchScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 5
    },
})

