import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getReciverSocketId, io } from "../socket/socket.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const sendMessage = async (req, res) => {
    try {
        let sender = req.userId;
        let { receiver } = req.params;
        let { ciphertext, iv } = req.body;  
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }    
        let conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] },
        });
        let  newMessage = await Message.create({
            sender,
            receiver,
            ciphertext,
            iv,
            image
        });
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender, receiver],
                messages: [newMessage._id]
            });
        }
        else {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }
        const receiverSocketId = getReciverSocketId(receiver); // Retrieve the socketId for the receiver
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage); // Emit the new message to the receiver's socket
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getMessages = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            participants: {
                $all: [req.userId, req.params.receiver]
            },
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json([]);
        }

        return res.status(200).json(conversation.messages);

    } catch (error) {
        console.error("Error fetching messages:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};
