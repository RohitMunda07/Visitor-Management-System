import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: false,
    id: "",
    name: "",
    person: "",
    contact: "",
    company: "",
    work: "",
    addharDetails: "",
    image: "",
    status: ""
}

export const visitorDetailsSlice = createSlice({
    name: "visitorDetail",
    initialState,
    reducers: {

        addVisitorDetails: (state, action) => {
            Object.assign(state, action.payload);
            state.value = true;
        },

        closeVisitorDetails: (state) => {
            state.value = false;
        }
    }
})

export const { addVisitorDetails, closeVisitorDetails } = visitorDetailsSlice.actions;
export default visitorDetailsSlice.reducer;