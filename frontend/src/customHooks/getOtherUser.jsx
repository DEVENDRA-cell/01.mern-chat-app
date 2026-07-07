import {  setOtherUsers, setUserData } from "../redux/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import {serverUrl}  from "../config.js";

const getOtherUsers = () => {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);

    useEffect(() => {
        if (!userData) return;

        const fetchOtherUsers = async () => {
            try {
                const { data } = await axios.get(
                    serverUrl + "/api/user/others",
                    { withCredentials: true }
                );

                if (data.users) {
                    dispatch(setOtherUsers(data.users));
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchOtherUsers();
    }, [dispatch, userData]);
};

export default getOtherUsers;
