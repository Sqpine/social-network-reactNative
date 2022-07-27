import {createNativeStackNavigator, NativeStackScreenProps} from "@react-navigation/native-stack";
import NotFoundScreen from "../screens/NotFoundScreen";
import ModalScreen from "../screens/ModalScreen";
import * as React from "react";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import HomeScreen from "../screens/HomeScreen";
import {Text} from '../components/Themed'
import {RootTabParamList, RootTabScreenProps} from "../types";
import {AntDesign, Entypo, Ionicons} from "@expo/vector-icons";
import {Pressable, TouchableOpacity} from "react-native";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import PhotoScreen from "../screens/PhotoScreen";
import SaveScreen from "../screens/SaveScreen";
import PostScreen from "../screens/PostScreen/PostScreen";
import SearchScreen from "../screens/SearchScreen/SearchScreen";
import {useNavigation} from "@react-navigation/native";
import EditProfileScreen from "../screens/EditScreen/EditProfileScreen";
import DoneButton from "../screens/EditScreen/DoneButton";
import FollowingScreen from "../screens/ProfileScreen/FollowingScreen";
import CommentScreen from "../screens/CommentScreen";
import ChatsScreen from "../screens/ChatsScreen/ChatsScreen";
import MessagesScreen from "../screens/MessagesScreen/MessagesScreen";
import ChoseUserScreen from "../screens/ChoseUserScreen";

const Stack = createNativeStackNavigator<RootTabParamList>();
const BottomTab = createBottomTabNavigator<RootTabParamList>();

const BottomTabNavigator = () => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation<NativeStackScreenProps<RootTabParamList, 'Profile'>['navigation']>()
    return (
        <BottomTab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme].tint,
            }}>
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={({navigation}: RootTabScreenProps<'Home'>) => ({
                    tabBarIcon: ({color}) => <AntDesign name="home" size={24} color={color}/>,
                    headerRight: () => (
                        <Pressable
                            onPress={() => navigation.navigate('Chats')}
                            style={({pressed}) => ({
                                opacity: pressed ? 0.5 : 1,
                            })}>
                            <AntDesign name="message1" size={25}
                                       color={Colors[colorScheme].text}
                                       style={{marginRight: 15}}
                            />
                        </Pressable>
                    ),
                })}
            />
            <BottomTab.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarIcon: ({color}) => <AntDesign name="search1" size={24} color={color}/>,
                }}
            />
            <BottomTab.Screen
                name="CreatePost"
                component={PhotoScreen}
                options={{
                    tabBarIcon: ({color}) => <Ionicons name="add-circle-outline" size={24} color={color}/>,
                }}
            />
            <BottomTab.Screen
                name="Profile"
                component={ProfileScreen}
                options={({navigation}: RootTabScreenProps<'Profile'>) => ({
                    tabBarIcon: ({color}) => <AntDesign name="user" size={24} color={color}/>,
                })}
                listeners={{
                    tabPress: (event) => {
                        event.preventDefault();
                        navigation.navigate('Profile', {id: ''})
                    }
                }}
            />
        </BottomTab.Navigator>
    );
}

const RootNavigator = () => {
    const colorScheme = useColorScheme();
    const navigation = useNavigation<NativeStackScreenProps<RootTabParamList, 'Profile'>['navigation']>()
    return (
        <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} options={{headerShown: false}}/>
            <Stack.Screen name="Save" component={SaveScreen} options={{title: 'Save'}}/>
            <Stack.Screen name="Post" component={PostScreen} options={{title: 'Post'}}/>
            <Stack.Screen name="CreatePost" component={PhotoScreen} options={{title: 'Create Post'}}/>
            <Stack.Screen name="Following" component={FollowingScreen}/>
            <Stack.Screen name="Comments" component={CommentScreen}/>
            <Stack.Screen
                name="Chats"
                component={ChatsScreen}
                options={(props: NativeStackScreenProps<RootTabParamList, 'Chats'>) => ({
                    headerRight: () => (
                        <Pressable
                            onPress={() => props.navigation.navigate('ChoseUser')}
                            style={({pressed}) => ({
                                opacity: pressed ? 0.5 : 1,
                            })}>
                            <Entypo
                                name="new-message"
                                size={20}
                                color={Colors[colorScheme].text}
                                style={{marginRight: 15}}
                            />
                        </Pressable>
                    )
                })}
            />
            <Stack.Screen name="Messages" options={
                (props: NativeStackScreenProps<RootTabParamList, 'Messages'>) => (
                    {
                        title: props.route.params.userName,
                        headerLeft: () => <Ionicons
                            style={{marginRight: 30, marginLeft: 15}}
                            onPress={() => props.navigation.navigate('Chats')}
                            name="arrow-back-outline"
                            size={24}
                            color="black"
                        />

                    }
                )} component={MessagesScreen}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{
                    headerTitleAlign: 'center',
                    title: 'Edit Profile',
                    headerRight: () => <DoneButton/>,
                    headerLeft: () => <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text>
                            Cancel
                        </Text>
                    </TouchableOpacity>,
                }}/>
            <Stack.Screen
                name="ChoseUser"
                component={ChoseUserScreen}
                options={{
                    title: 'Chose user',
                }}
            />
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{title: 'Oops!'}}/>
            <Stack.Group screenOptions={{presentation: 'modal'}}>
                <Stack.Screen name="Modal" component={ModalScreen}/>
            </Stack.Group>
        </Stack.Navigator>
    );
}
export default RootNavigator;