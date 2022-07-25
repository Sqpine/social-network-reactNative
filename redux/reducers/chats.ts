import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import firebase from "firebase/compat";
import {UserType} from "./user";

export type MessageType = {
    data: firebase.firestore.Timestamp
    id: string
    message: string
}
export type ChatType = {
    chatId: string
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
        setMessages:(state,action:PayloadAction<MessageType[]>)=>{
            state.messages=action.payload
        }
    },
})
export const {setChats,setMessages} = chatsSlice.actions
export default chatsSlice.reducer