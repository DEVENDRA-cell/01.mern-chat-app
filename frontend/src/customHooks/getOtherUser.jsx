import {  setOtherUsers, setUserData } from "../redux/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import {serverUrl}  from "../config.js";

const getOtherUsers = () => {
    let dispatch = useDispatch();
    let { userData } = useSelector((state) => state.user);

    useEffect(() => {
        console.log("getOtherUsers called");
        console.log("userData in getOtherUsers:", userData);
        const fetchOtherUsers = async () => {
            console.log("Calling API...");
            try {
                const { data } = await axios.get(serverUrl + '/api/user/others', { withCredentials: true });   
                
console.log(data);   
                if (data) {
                    dispatch(setOtherUsers(data.users));
                }

            } catch (error) {
                console.error('Error fetching other users:', error);
            }
        }; 
        if(userData) { // Only fetch if userData is already set
            fetchOtherUsers();}
    }, [userData]); // Added userData and dispatch to the dependency array to avoid warnings    
}

export default getOtherUsers;
