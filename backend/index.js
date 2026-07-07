import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');
// Node.js DNS resolution has its own layer above the OS. dns.setServers() operates at the runtime layer
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { app, server } from './socket/socket.js';

app.use(cors({
    origin: 'http://localhost:5173', // Update with your frontend URL
    credentials: true, // Allow cookies to be sent
}));

app.use(express.json());
app.use(cookieParser());


const port = process.env.PORT || 5000;
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);


server.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});