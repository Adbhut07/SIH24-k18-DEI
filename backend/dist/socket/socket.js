"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const initializeSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", // Replace "*" with your frontend URL in production
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
        // Join a specific interview room
        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
        });
        // Leave a specific interview room
        socket.on("leaveRoom", (roomId) => {
            socket.leave(roomId);
            console.log(`User ${socket.id} left room ${roomId}`);
        });
        // Handle message sending
        socket.on("sendMessage", (messageData) => {
            // Broadcast the message to all clients in the room except the sender
            socket.to(messageData.roomId).emit("receiveMessage", {
                id: messageData.id,
                sender: messageData.sender,
                message: messageData.message
            });
        });
        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
    return io;
};
exports.default = initializeSocket;
