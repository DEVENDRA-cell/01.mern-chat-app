import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config.js";
import { setMessages } from "../redux/messageSlice.js";
import { getMyPrivateKey, getSessionKey, decryptStoredMessage } from "../utils/cryptoUtils.js";

const getMessages = () => {
    const dispatch = useDispatch();

    const { userData, selectedUser } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        if (!userData || !selectedUser) return;

        const fetchMessages = async () => {
            try {
                const data = await axios.get(
                    `${serverUrl}/api/message/get/${selectedUser._id}`,
                    {
                        withCredentials: true
                    }
                );

                const myPrivateKey = await getMyPrivateKey(userData._id);
                const sessionKey = await getSessionKey(userData._id, myPrivateKey, selectedUser);

                const decryptedMessages = await Promise.all(
                    data.data.map((msg) => decryptStoredMessage(sessionKey, msg))
                );

                dispatch(setMessages(decryptedMessages));

            } catch (error) {
                console.error(error);
            }
        };

        fetchMessages();

    }, [dispatch, userData, selectedUser]);
};

export default getMessages;
