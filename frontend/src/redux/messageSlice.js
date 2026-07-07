import { createSlice } from "@reduxjs/toolkit";
const messageSlice   = createSlice({
    name: "message",
    initialState: { // like useState 
        messages: [],
    },
    reducers: { // like setUserData in useState
        setMessages: (state, action) => {
            state.messages = action.payload;
        }
    } 
});

export const { setMessages } = messageSlice.actions;
// action on messageslice perfomed through setMessages.
export default messageSlice.reducer;