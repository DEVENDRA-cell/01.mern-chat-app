import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';

export const store = configureStore({
    reducer: {
        user: userSlice
    }
}) 
// now go to signup.jsx and login.jsx and import the store and use it to dispatch the action to set the user data.