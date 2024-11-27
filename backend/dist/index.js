"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const interview_route_1 = __importDefault(require("./routes/interview.route"));
const candidate_route_1 = __importDefault(require("./routes/candidate.route"));
const userProfile_route_1 = __importDefault(require("./routes/userProfile.route"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const corsOptions = {
    origin: ['http://localhost:3000', 'https://your-production-domain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(errorHandler_1.default);
app.use('/api/v1/auth', auth_route_1.default);
app.use('/api/v1/user', user_route_1.default);
app.use('/api/v1/interview', interview_route_1.default);
app.use('/api/v1/candidate', candidate_route_1.default);
app.use('/api/v1/userProfile', userProfile_route_1.default);
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// io.on('connection', (socket) => {
//     console.log(`User connected: ${socket.id}`);
//     socket.on("create-room", ({ userId }, callback) => {
//       const roomId = `room-${Math.random().toString(36).substr(2, 8)}`;
//       rooms[roomId] = { users: [userId] };
//       socket.join(roomId);
//       console.log(`Room created: ${roomId}`);
//       callback({ roomId });
//     });
//     // Handle joining a room
//     // socket.on('join-room', async ({ roomId, userId }) => {
//     //     try {
//     //         const session = await findInterviewByRoomId(roomId);
//     //         if (!session) {
//     //             return socket.emit('error', { message: 'Invalid room ID' });
//     //         }
//     //         console.log(`User ${userId} joining room ${roomId}`);
//     //         socket.join(roomId);
//     //         // Add participant to the room
//     //         if (!roomParticipants[roomId]) {
//     //             roomParticipants[roomId] = new Set();
//     //           }
//     //           roomParticipants[roomId].add(userId);
//     //         // Notify other participants in the room
//     //         socket.to(roomId).emit('user-joined', { userId });
//     //     } catch (error) {
//     //         console.error('Error joining room:', error);
//     //         socket.emit('error', { message: 'Failed to join room' });
//     //     }
//     // });
//     socket.on("join-room", ({ roomId, userId }, callback) => {
//       if (rooms[roomId]) {
//         rooms[roomId].users.push(userId);
//         socket.join(roomId);
//         console.log(`User ${userId} joined room ${roomId}`);
//         // Notify existing users about the new participant
//         socket.to(roomId).emit("user-joined", { userId });
//         callback({ success: true });
//       } else {
//         console.log(`Room ${roomId} does not exist`);
//         callback({ error: "Room does not exist" });
//       }
//     });
//     socket.on("get-rtp-capabilities", async ({ roomId }, callback) => {
//         try {
//           const router = await getRouterForRoom(roomId);
//           callback(router.rtpCapabilities);
//         } catch (error) {
//           console.error("Error getting RTP capabilities:", error);
//           callback({ error: "Failed to retrieve RTP capabilities" });
//         }
//       });
//     // Handle WebRTC transport creation
//     socket.on("create-transport", async ({ roomId }, callback) => {
//         try {
//           const router = await getRouterForRoom(roomId);
//           const transport = await createWebRtcTransport(router);
//           transport.observer.on("close", () => {
//             console.log("Transport closed");
//           });
//           callback({
//             id: transport.id,
//             iceParameters: transport.iceParameters,
//             iceCandidates: transport.iceCandidates,
//             dtlsParameters: transport.dtlsParameters,
//           });
//         } catch (error) {
//           console.error("Error creating transport:", error);
//           callback({ error: "Failed to create transport" });
//         }
//     });
//     // Handle transport connection
//     socket.on("connect-transport", async ({ transportId, dtlsParameters }, callback) => {
//         try {
//           const transport = getTransportById(transportId);
//           if (!transport) {
//             throw new Error(`Transport with ID ${transportId} not found`);
//           }
//           await transport.connect({ dtlsParameters });
//           callback({ success: true });
//         } catch (error) {
//           console.error("Error connecting transport:", error);
//           callback({ error: "Failed to connect transport" });
//         }
//     });
//     // Handle producing media (publishing streams)
//     socket.on("produce", async ({ transportId, kind, rtpParameters, roomId }, callback) => {
//       try {
//         const transport = getTransportById(transportId);
//         if (!transport) {
//           throw new Error(`Transport with ID ${transportId} not found`);
//         }
//         const producer = await transport.produce({ kind, rtpParameters });
//         producer.observer.on("close", () => {
//           console.log("Producer closed");
//         });
//         callback({ id: producer.id });
//         // Notify other participants about the new producer
//         socket.to(roomId).emit("new-producer", {
//           producerId: producer.id,
//           kind: producer.kind,
//         });
//       } catch (error) {
//         console.error("Error producing media:", error);
//         callback({ error: "Failed to produce" });
//       }
//     });
//     // Handle consuming media (subscribing to streams)
//     socket.on("consume", async ({ producerId, rtpCapabilities, roomId }, callback) => {
//       try {
//         const router = await getRouterForRoom(roomId);
//         if (!router.canConsume({ producerId, rtpCapabilities })) {
//           return callback({ error: "Cannot consume" });
//         }
//         const consumer = await router.createConsumer({ producerId, rtpCapabilities });
//         callback({
//           id: consumer.id,
//           producerId,
//           kind: consumer.kind,
//           rtpParameters: consumer.rtpParameters,
//         });
//         consumer.observer.on("close", () => {
//           console.log("Consumer closed");
//         });
//       } catch (error) {
//         console.error("Error consuming media:", error);
//         callback({ error: "Failed to consume media" });
//       }
//     });
//     // Disconnect handler
//     socket.on('disconnect', () => {
//         console.log(`User disconnected: ${socket.id}`);
//     });
// });
