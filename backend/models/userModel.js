import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",
    },
    publicKeys: [
        {
            deviceId: { type: String, required: true },
            key: { type: String, required: true },
        }
    ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;