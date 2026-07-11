import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import genToken  from "../config/token.js";

const isProduction = process.env.NODE_ENV === "production";
export const signUp = async (req, res) => {
    let { username, email, password } = req.body;
    try {
        // Check if the user already exists
        if(!username || !email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user
        const user = await User.create({ username, email, password: hashedPassword });
        const token = genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        const userToSend = await User.findById(user._id).select("-password");
        
        res.status(201).json({ message: "User registered successfully", user: userToSend });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const signIn = async (req, res) => {
    let { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
        }); 
       const userToSend = await User.findById(user._id).select("-password");
        res.status(200).json({ message: "User signed in successfully", user: userToSend });
    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({ message: "Server error" });
    }   
}

export const signOut = (req, res) => {

    res.clearCookie("token", {
        path: "/",
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
    });

    console.log("After clearCookie");

    res.json({
        success: true,
    });
};