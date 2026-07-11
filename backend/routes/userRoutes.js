import express from "express";
const userRouter = express.Router();
import { getCurrentUser, getOtherUsers, updateProfilePicture ,searchUsers, updatePublicKey} from "../controllers/userController.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

// Define your user-related routes here
userRouter.get("/me", isAuth, getCurrentUser);   
userRouter.put("/profile",isAuth,upload.single('profileimg'), updateProfilePicture);
userRouter.get("/others", isAuth, getOtherUsers);
userRouter.get("/search", isAuth, searchUsers);
userRouter.put("/updatePublicKey", isAuth, updatePublicKey); 

export default userRouter;