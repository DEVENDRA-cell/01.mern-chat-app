import Conversation from "./conversationModel.js";
import Message from "./messageModel.js";

export const sendMessage = async (req, res) => {
    try {
        let { sender} = req.userId;
        let { receiver } = req.params;
        let { message } = req.body;  
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
            message,
            image
        });
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender, receiver],
                messages: [newMessage._id]
            });
        }
        await conversation.messages.push(newMessage._id);
        conversation.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const getMessages = async (req, res) => {    
    try {
        let conversation = await Conversation.findOne({
            participants: { $all: [req.userId, req.params.receiver] },
        }).populate("messages"); 
        if (!conversation) {
            return res.status(404).json({ message: "No conversation found" });
        }
        res.status(200).json(conversation.messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
