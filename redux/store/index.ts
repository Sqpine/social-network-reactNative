import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../reducers/user'
import chatsReducer from '../reducers/chats'

export const store = configureStore({
    reducer: {
        userState: userReducer,
        chatsState: chatsReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch