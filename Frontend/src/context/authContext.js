import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: sessionStorage.getItem("access") ? true : false,
    refreshToken: sessionStorage.getItem("refresh"),
    accessToken: sessionStorage.getItem("access"),
    role: sessionStorage.getItem("role")
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.isAuthenticated = true;
            state.accessToken = action.payload?.accessToken || "";
            state.refreshToken = action.payload?.refreshToken || "";
            state.role = action.payload?.role || "";
        },
        removeAuth: (state) => {
            state.isAuthenticated = false;
            state.accessToken = "";
            state.refreshToken = "";
            state.role = "";
        }
    }
})

export default authSlice.reducer;
export const { setAuth, removeAuth } = authSlice.actions;