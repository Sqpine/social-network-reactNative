import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import firebase from "firebase/compat";
import {UserType} from "./user";

export type MessageType = {
    date: firebase.firestore.Timestamp
    id: string
    message: string
}
export type ChatType = {
    chatID: string
    users: string[]
    preview: UserType | null
}
type InitialStateType = {
    chats: ChatType[]
    messages: MessageType[]
    isFetching: boolean
}
const initialState: InitialStateType = {
    chats: [],
    messages: [],
    isFetching: false
}

export const chatsSlice = createSlice({
    name: 'chats',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setChats: (state, action: PayloadAction<ChatType[]>) => {
            state.chats = action.payload
        },
        setMessages: (state, action: PayloadAction<MessageType[]>) => {
            state.messages = action.payload
        },
        removeChats: (state, action: PayloadAction<string>) => {
            const id = action.payload
            const index = state.chats.findIndex(chat => chat.chatID === id)
            
            if (index > -1) {
                state.chats.splice(index, 1)
            }
        }
    },
})

export const {setChats, removeChats, setMessages} = chatsSlice.actions
export default chatsSlice.reducer