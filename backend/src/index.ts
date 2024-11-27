import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import "dotenv/config";
import cors from 'cors';

import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import errorHandler from './utils/errorHandler';
import interviewRoutes from './routes/interview.route';
import candidateRoutes from './routes/candidate.route';
import userProfileRoutes from './routes/userProfile.route';


const app = express();
const port = process.env.PORT || 5000;


const corsOptions = {
    origin: ['http://localhost:3000', 'https://your-production-domain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], 
    credentials: true, 
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(errorHandler);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/interview', interviewRoutes);
app.use('/api/v1/candidate', candidateRoutes);
app.use('/api/v1/userProfile', userProfileRoutes);

app.get('/', (req: Request, res: Response) => {
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