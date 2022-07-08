import SignInUp from "../screens/SignInUp";
import * as React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import NotFoundScreen from "../screens/NotFoundScreen";

export type StackParamList = {
    Root: undefined;
    NotFound: undefined;
}
const Stack = createNativeStackNavigator<StackParamList>();
const GuestNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Root">
            <Stack.Screen name="Root" component={SignInUp} options={{title: 'Register or Login'}}/>
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
        </Stack.Navigator>
    );
}
export default GuestNavigator;