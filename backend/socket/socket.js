import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const userSocketMap = new Map();

export const getReciverSocketId = (receiverId) => {
    return userSocketMap.get(receiverId);
};

io.on("connection", (socket) => {

    const userId = socket.handshake.query.userId;

    if (!userId || userId === "undefined") {
        console.log("Invalid User ID:", userId);
        socket.disconnect();
        return;
    }

    console.log("User connected:", userId);
    console.log("Socket ID:", socket.id);

    // Add user to Map
    userSocketMap.set(userId, socket.id);

    console.log(
        "Current online users:",
        Array.from(userSocketMap.keys())
    );

    // Send online users to every connected client
    io.emit(
        "getOnlineUsers",
        Array.from(userSocketMap.keys())
    );

    socket.on("disconnect", () => {

        console.log("User disconnected:", userId);

        // Delete only if this is still the current socket
        // belonging to this user
        if (userSocketMap.get(userId) === socket.id) {
            userSocketMap.delete(userId);
        }

        console.log(
            "Online users after disconnect:",
            Array.from(userSocketMap.keys())
        );

        // Send updated list
        io.emit(
            "getOnlineUsers",
            Array.from(userSocketMap.keys())
        );
    });
});

export { server, app, io };