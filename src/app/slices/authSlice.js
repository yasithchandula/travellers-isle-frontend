// src/app/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("auth_token"),
    user: localStorage.getItem("auth_user")
        ? JSON.parse(localStorage.getItem("auth_user"))
        : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },

        logout(state) {
            state.token = null;
            state.user = null;
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
