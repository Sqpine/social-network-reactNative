/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {ColorSchemeName, View} from 'react-native';
import {Text} from "../components/Themed";
import UserNavigator from "./UserNavigator";
import GuestNavigator from "./GuestNavigator";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../firebase";

export default function Navigation({colorScheme}: { colorScheme: ColorSchemeName }) {
    const [isFetching, setFetching] = useState(false);
    const [isLogged, setLogged] = useState(false);
    useEffect(() => {
        setFetching(true);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;
                setLogged(true)
            } else {
                setLogged(false)
            }
            setFetching(false)
        });
        return () => unsubscribe()
    }, [])

    if (isFetching) {
        return (
            <View>
                <Text>Loading</Text>
            </View>
        )
    }
    if (isLogged) {
        return (
            <NavigationContainer
                // linking={LinkingConfiguration}
                theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <UserNavigator/>
            </NavigationContainer>
        );
    }
    return (
        <NavigationContainer
            // linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <GuestNavigator/>
        </NavigationContainer>
    )
}
