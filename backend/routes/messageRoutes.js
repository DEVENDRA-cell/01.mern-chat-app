import express from "express";
const messageRouter = express.Router();
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
import { getMessages, sendMessage } from "../models/messageController.js";

messageRouter.put("/send/:receiver",isAuth,upload.single('profileimg'), sendMessage);
messageRouter.get("/get/:receiver",isAuth, getMessages);

export default messageRouter;