import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

const userSocketMap = {};

export const getReciverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {

    console.log(
        "USER CONNECTED:",
        socket.handshake.query.userId
    );


    const userId =
        socket.handshake.query.userId;


    if (userId) {

        userSocketMap[userId] =
            socket.id;

    }


    io.emit(
        "getOnlineUsers",
        Object.keys(userSocketMap)
    );


    console.log("EMITTING REFRESH USERS");

    io.emit("refreshUsers");


    socket.on("disconnect", () => {

        delete userSocketMap[userId];


        io.emit(
            "getOnlineUsers",
            Object.keys(userSocketMap)
        );

    });

});

export { server, app, io };