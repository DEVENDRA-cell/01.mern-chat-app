import { setOtherUsers } from "../redux/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config.js";


const useGetOtherUsers = () => {

    const dispatch = useDispatch();

    const { userData } = useSelector(
        (state) => state.user
    );


    const fetchOtherUsers = useCallback(async () => {

        try {

            const { data } = await axios.get(
                serverUrl + "/api/user/others",
                {
                    withCredentials: true
                }
            );


            if (data.users) {

                dispatch(
                    setOtherUsers(data.users)
                );

            }

        } catch (error) {

            console.error(error);

        }

    }, [dispatch]);


    useEffect(() => {

        if (!userData) return;

        fetchOtherUsers();

    }, [userData, fetchOtherUsers]);


    return fetchOtherUsers;
};


export default useGetOtherUsers;