import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
export const getCurrentUser = async (req, res) => {
    console.log("Cookies:", req.cookies);
    console.log("Token:", req.cookies.token);

    try{

    let userid = req.userId;
    // Fetch user details from the database using the userid
    let user = await User.findById(userid).select("-password"); // Exclude password from the response
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
        },{ new: true }).select("-password"); // Exclude password from the response
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