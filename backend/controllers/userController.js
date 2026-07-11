import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
export const getCurrentUser = async (req, res) => {

    try{

    let userid = req.userId; // we got userid from the auth middleware, which decoded the JWT and attached the userId to the request object.
    // Fetch user details from the database using the userid
    let user = await User.findById(userid).select("-password"); 
    if(!user){
        return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
    }catch(error){
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const updateProfilePicture = async (req, res) => {
    try {
        let {name} = req.body;
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path);
        }
        let user = await User.findByIdAndUpdate(req.userId,{
            name, image 
        },{ new: true }).select("-password");
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ message: "Server error" });
        }
}

export const getOtherUsers = async (req, res) => {
    try {
        let users = await User.find({ _id: { $ne: req.userId } }).select("-password");
        res.json({users});
    }
    catch (error) {
        console.error("Error fetching other users:", error);
        res.status(500).json({ message: "Server error" });
    }   
}
export const searchUsers = async (req, res) => {
    try{
    let {query } = req.query;
    if(!query) {    
        return res.status(400).json({ message: "Query parameter is required" });
    }
    let users = await User.find({
        _id: { $ne: req.userId }, // Exclude the current user from the search results
        $or: [
            { name: { $regex: query, $options: "i" } },
            { username: { $regex: query, $options: "i" } }  
        ]
        }
    ).select("-password");
    res.status(200).json(users);
}    catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Server error" });
    }
}
export const updatePublicKey = async (req, res) => {
    try {
        const { deviceId, publicKey } = req.body;
        if (!deviceId || !publicKey) {
            return res.status(400).json({ message: "deviceId and publicKey are required" });
        }
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const existing = user.publicKeys.find((pk) => pk.deviceId === deviceId);
        if (existing) {
            existing.key = JSON.stringify(publicKey);
        } else {
            user.publicKeys.push({ deviceId, key: JSON.stringify(publicKey) });
        }
        await user.save();
        const userToSend = await User.findById(req.userId).select("-password -email");
        res.json(userToSend);
    } catch (error) {
        console.error("Error updating public key:", error);
        res.status(500).json({ message: "Server error" });
    }
}
