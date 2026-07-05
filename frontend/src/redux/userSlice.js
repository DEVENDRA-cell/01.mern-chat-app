import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "user",
    initialState: { // like useState 
        userData: null,
        loading: true,
        otherUsers: null,
        selectedUser: null
    },
    reducers: { // like setUserData in useState
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setOtherUsers: (state, action) => {
            state.otherUsers = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        }
    } 
});

export const { setUserData, setLoading, setOtherUsers, setSelectedUser } = userSlice.actions;
// action on userslice perfomed through setUserData.
export default userSlice.reducer;