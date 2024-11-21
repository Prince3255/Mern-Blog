import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload,
            state.loading = false,
            state.error = null
        },
        signInFailure: (state, action) => {
            state.error = action.payload,
            state.loading = false
        },
        updateUserStart: (state) => {
            state.loading = true
            state.error = null
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload,
            state.loading = false
            state.error = null
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload,
            state.loading = false
        },
        deleteUserStart: (state) => {
            state.loading = true
            state.error = null
        },
        deleteUserSuccess: (state) => {
            state.currentUser = null,
            state.loading = false
            state.error = null
        },
        deleteUserFailure: (state, action) => {
            state.error = action.payload,
            state.loading = false
        },
        logoutUserSuccess: (state) => {
            state.currentUser = null,
            state.loading = false
            state.error = null
        }
    }
})

export const { signInStart, signInSuccess, signInFailure, updateUserStart, updateUserFailure, updateUserSuccess, deleteUserStart, deleteUserFailure, deleteUserSuccess, logoutUserSuccess } = userSlice.actions

export default userSlice.reducer;