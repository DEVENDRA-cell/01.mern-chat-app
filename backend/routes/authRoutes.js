import express from "express";
const authRouter = express.Router();
import {signUp,signIn,signOut}  from "../controllers/authController.js";


// Define your authentication routes here   
authRouter.post("/signup", signUp);
authRouter.post("/login", signIn);
authRouter.post("/logout", signOut);

export default authRouter;