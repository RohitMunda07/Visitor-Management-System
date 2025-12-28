import { configureStore } from "@reduxjs/toolkit";
import visitorDetailsReducer from "./visitorDetailSlice";

export const store = configureStore({
    reducer: {
        visitorDetail: visitorDetailsReducer,
    }
})