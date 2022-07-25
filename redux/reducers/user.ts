import {createAsyncThunk, createSlice, isAnyOf, PayloadAction} from '@reduxjs/toolkit'
import {collection, doc, getDoc, getDocs, onSnapshot} from "firebase/firestore";
import {auth, db} from "../../firebase";
import firebase from "firebase/compat";
export type EditInfoType = {
    name: string
    bio: string
    uri: string | null
}
export type UsersPostsType = {
    id: string
    caption: string
    creation: firebase.firestore.FieldValue
    downloadURL: string
    likeCount: number
}
// Define a type for the slice state
export type UserState = {
    user: null | UserType
    isFetching: boolean
    followedUsers: string[]
    yourFollowedUsers: string[]
    editInfo: EditInfoType
    userPosts: UsersPostsType[] | null
    postComments: CommentType[]
}

// Define the initial state using that type
const initialState: UserState = {
    user: null,
    followedUsers: [],
    yourFollowedUsers: [],
    editInfo: {name: '', bio: '', uri: null},
    userPosts: null,
    postComments: [],
    isFetching: false
}

export const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setEditName: (state, action: PayloadAction<string>) => {
            state.editInfo.name = action.payload
        },
        setEditBio: (state, action: PayloadAction<string>) => {
            state.editInfo.bio = action.payload
        },
        setAvatar: (state, action: PayloadAction<string>) => {
            state.editInfo.uri = action.payload
        },
        setFollowed: (state, action: PayloadAction<string[]>) => {
            state.followedUsers = action.payload
        },
        setYourUsersFollowed: (state, action: PayloadAction<string[]>) => {
            state.yourFollowedUsers = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(GetUserThunk.fulfilled,
            (state, {payload}) => {

                state.user = payload
                state.editInfo.name = payload ? payload.name : ''
                state.editInfo.uri = payload ? payload.uri : null
                state.editInfo.bio = payload ? payload.bio : ''
                state.isFetching = false
            })
        builder.addCase(GetFollowingUsers.fulfilled,
            (state, {payload}) => {
                state.isFetching = false
            })
        builder.addCase(GetPostComments.fulfilled,
            (state, {payload}) => {
                state.isFetching = false
                state.postComments = payload
            })
        builder.addCase(GetUserPosts.fulfilled,
            (state, {payload}) => {

                state.userPosts = payload
                state.isFetching = false
            })
        builder.addMatcher(isAnyOf(GetUserPosts.pending, GetUserThunk.pending, GetFollowingUsers.pending),
            (state) => {
                if (!state.isFetching) {
                    state.isFetching = true
                }
            })
    }
})

export const {setEditName, setEditBio, setYourUsersFollowed, setFollowed, setAvatar} = userSlice.actions
export default userSlice.reducer
export const GetUserThunk =
    createAsyncThunk<UserType | null, string, { rejectValue: string }>(
        'user/GetUserThunk',
        async (id,
               {dispatch, rejectWithValue}) => {
            try {
                const res = await getDoc(doc(db, "users", id))
                if (res.exists()) {
                    return {
                        ...res.data() as UserType,
                        id: res.id,
                    }
                } else {
                    console.log('empty')
                }
                return null
            } catch (error) {
                // if (axios.isAxiosError(error)) {
                // dispatch(setError({error: error.message}))
                // }
                return rejectWithValue('server error')
            }
        }
    )
export const GetUserPosts =
    createAsyncThunk<UsersPostsType[] | null, string, { rejectValue: string }>(
        'user/GetUserPosts',
        async (id,
               {dispatch, rejectWithValue}) => {
            try {
                const querySnapshot = await getDocs(collection(db, 'post', id, 'userPosts'))
                let response: UsersPostsType[] = []

                querySnapshot.forEach((doc) => {
                    const postsData = doc.data() as UserPostsRespType
                    response = [...response, {id: doc.id, ...postsData}]
                });

                if (response.length === 0) return null
                return response
            } catch (error) {
                // if (axios.isAxiosError(error)) {
                // dispatch(setError({error: error.message}))
                // }
                return rejectWithValue('server error')
            }
        }
    )
type GetPostCommentsParamsType = { postId: string, userId: string }
export const GetPostComments =
    createAsyncThunk<CommentType[], GetPostCommentsParamsType, { rejectValue: string }>(
        'user/GetPostComments',
        async ({postId, userId},
               {dispatch, rejectWithValue}) => {
            try {
                const querySnapshot = await getDocs(collection(db, 'post', userId, 'userPosts', postId, 'comments'))
                let response: CommentType[] = []

                querySnapshot.forEach((doc) => {
                    const postsData = doc.data() as CommentType
                    response = [...response, {...postsData, postId: doc.id,}]
                });

                return response
            } catch (error) {
                // if (axios.isAxiosError(error)) {
                // dispatch(setError({error: error.message}))
                // }
                return rejectWithValue('server error')
            }
        }
    )
export const GetFollowingUsers =
    createAsyncThunk<void, string, { rejectValue: string }>(
        'user/GetFollowingUsers',
        async (id, {dispatch, rejectWithValue}) => {
            try {
                const currentId = auth.currentUser!.uid
                let response: string[] = []
                const querySnapshot = await onSnapshot(collection(db, 'following', id, 'userFollowing'), (res) => {
                    response = res.docs.map((doc) => doc.id);
                    dispatch(setFollowed(response))
                    if (id === currentId) {
                        dispatch(setYourUsersFollowed(response))
                    }
                })
            } catch (error) {
                // if (axios.isAxiosError(error)) {
                // dispatch(setError({error: error.message}))
                // }
                return rejectWithValue('server error')
            }
        }
    )
export type UserType = {
    chatsID: string[]
    name: string
    email: string
    uri: string
    bio: string
    id: string
}
type UserPostsRespType = {
    caption: string
    creation: firebase.firestore.FieldValue
    downloadURL: string
    likeCount: number
}
export type CommentType = {
    creator: string,
    text: string,
    postId: string,
}