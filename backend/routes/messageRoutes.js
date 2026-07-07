import express from "express";
const messageRouter = express.Router();
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

messageRouter.post("/send/:receiver",isAuth,upload.single('profileimg'), sendMessage);
messageRouter.get("/get/:receiver",isAuth, getMessages);

export default messageRouter;