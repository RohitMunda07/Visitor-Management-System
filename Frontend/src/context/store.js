import { configureStore } from "@reduxjs/toolkit";
import visitorDetailsReducer from "./visitorDetailSlice";
import authReducer from "./authContext";

export const store = configureStore({
    reducer: {
        visitorDetail: visitorDetailsReducer,
        auth: authReducer,
    }
})