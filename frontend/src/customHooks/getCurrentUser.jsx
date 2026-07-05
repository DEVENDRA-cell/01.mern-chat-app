import { setLoading, setUserData } from "../redux/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import {serverUrl}  from "../config.js";

const getCurrentUser =  () => {
    let dispatch = useDispatch();
    let { userData } = useSelector((state) => state.user);
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const { data } = await axios.get(serverUrl + '/api/user/me', { withCredentials: true });      
                if (data) {
                    dispatch(setUserData(data.user));
                }

            } catch (error) {
                console.error('Error fetching current user:', error);
            }
            finally {
                dispatch(setLoading(false));
            }   
        }; 
        if (!userData) { // Only fetch if userData is not already set
            fetchCurrentUser();}
            else {
                dispatch(setLoading(false));
            }
    }, [userData]);
}

export default getCurrentUser;

/*
dispatch(setUserData(...)) after login/signup → "I already have the user's data, so save it immediately."
useCurrentUser() → "I don't know who the user is yet, so ask the backend using the cookie."
These two pieces work together to give you both a fast login experience and persistent authentication across page refreshes. The first piece (dispatch(setUserData(...))) is used after a successful login or signup to immediately store the user's data in the Redux store. The second piece (useCurrentUser()) is a custom hook that checks if the user data is already available in the Redux store; if not, it makes a request to the backend to fetch the current user's data using the cookie for authentication. This ensures that even after a page refresh, the application can retrieve and maintain the user's authenticated state.  
These two pieces work together to give you both a fast login experience and persistent authentication across page refreshes*/