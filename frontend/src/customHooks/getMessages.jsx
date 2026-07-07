import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config.js";
import { setMessages } from "../redux/messageSlice.js";

const getMessages = () => {
    const dispatch = useDispatch();

    const { userData, selectedUser } = useSelector(
        (state) => state.user
    );

    useEffect(() => {

        // selectedUser is initially null
        if (!userData || !selectedUser) return;

        const fetchMessages = async () => {
            try {
                const data = await axios.get(
                    `${serverUrl}/api/message/get/${selectedUser._id}`,
                    {
                        withCredentials: true
                    }
                );

                dispatch(setMessages(data.data));

            } catch (error) {
                console.error(error);
            }
        };

        fetchMessages();

    }, [dispatch, userData, selectedUser]);
};

export default getMessages;