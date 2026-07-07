import { setIsCheckingAuth, setUserData } from "../redux/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config.js";

const getCurrentUser = () => {
    const dispatch = useDispatch();
    const { userData, isCheckingAuth } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const { data } = await axios.get(
                    serverUrl + "/api/user/me",
                    { withCredentials: true }
                );

                if (data.user) {
                    dispatch(setUserData(data.user));
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
            } finally {
                dispatch(setIsCheckingAuth(false));
            }
        };
        fetchCurrentUser(); 
    }, []);
};

export default getCurrentUser;