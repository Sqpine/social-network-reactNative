/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, NavigatorScreenParams, RouteProp} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {
        }
    }
}

export type RootStackParamList = {
    Root: NavigatorScreenParams<RootTabParamList> | undefined;
    Modal: undefined;
    NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList,
    Screen>;

export type RootTabParamList = {
    Root: undefined
    NotFound: undefined
    Modal: undefined
    Home: undefined
    Profile: { id: string | undefined } | undefined
    CreatePost: undefined
    Search: undefined
    Save: {
        image: string
    } | undefined
    Post: {
        likesCount: number
        caption: string
        image: string
        postId: string
        userId: string
    },
    Comments: {
        postId: string
        userId: string
    },
    Messages: {
        userName: string
        chatID: string
    },
    ChoseUser: undefined
    Chats: undefined
    EditProfile: undefined
    Following: undefined


};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>>;


export type RootRouteProps<RouteName extends keyof RootTabParamList> = RouteProp<RootTabParamList,
    RouteName>;
