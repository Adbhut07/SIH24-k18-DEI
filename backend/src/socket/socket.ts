import { Server } from "socket.io";

const initializeSocket = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);
      
        socket.on("joinRoom", (roomId) => {
          socket.join(roomId);
          console.log(`User ${socket.id} joined room ${roomId}`);
        });
      
        socket.on("leaveRoom", (roomId) => {
          socket.leave(roomId);
          console.log(`User ${socket.id} left room ${roomId}`);
        });
      
        socket.on("sendMessage", (messageData) => {
          socket.to(messageData.roomId).emit("receiveMessage", {
            id: messageData.id,
            sender: messageData.sender,
            message: messageData.message
          });
        });
      
        socket.on("disconnect", () => {
          console.log("User disconnected:", socket.id);
        });
    });

    return io;
};

export default initializeSocket;
