import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "user",
    initialState: { // like useState 
        userData: null,
        otherUsers: null,
        selectedUser: null,
        isCheckingAuth: true,
        socket: null, // Store the socket instance in the Redux state
        onlineUsers: null, // Store the list of online users in the Redux state
        searchResults: null, // Store the search results in the Redux state
    },
    reducers: { // like setUserData in useState
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setIsCheckingAuth: (state, action) => {
            state.isCheckingAuth = action.payload;
        },
        setOtherUsers: (state, action) => {
            state.otherUsers = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setSearchResults: (state, action) => {
            state.searchResults = action.payload;
        }
    } 
});

export const { setUserData, setIsCheckingAuth, setOtherUsers, setSelectedUser, setSocket, setOnlineUsers, setSearchResults } = userSlice.actions;
// action on userslice perfomed through setUserData.
export default userSlice.reducer;