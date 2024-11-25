"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoomId = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const uuid_1 = require("uuid");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const interview_route_1 = __importDefault(require("./routes/interview.route"));
const candidate_route_1 = __importDefault(require("./routes/candidate.route"));
const mediasoupServer_1 = require("./helper/mediasoupServer");
const interview_controller_1 = require("./controllers/interview/interview.controller");
const generateRoomId = () => {
    return (0, uuid_1.v4)();
};
exports.generateRoomId = generateRoomId;
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://your-production-domain.com"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mediasoupServer_1.createMediasoupWorker)();
}))();
const roomParticipants = {};
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Handle joining a room
    socket.on('join-room', (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, userId }) {
        try {
            const session = yield (0, interview_controller_1.findInterviewByRoomId)(roomId);
            if (!session) {
                return socket.emit('error', { message: 'Invalid room ID' });
            }
            console.log(`User ${userId} joining room ${roomId}`);
            socket.join(roomId);
            // Add participant to the room
            if (!roomParticipants[roomId]) {
                roomParticipants[roomId] = new Set();
            }
            roomParticipants[roomId].add(userId);
            // Notify other participants in the room
            socket.to(roomId).emit('user-joined', { userId });
        }
        catch (error) {
            console.error('Error joining room:', error);
            socket.emit('error', { message: 'Failed to join room' });
        }
    }));
    socket.on("get-rtp-capabilities", (_a, callback_1) => __awaiter(void 0, [_a, callback_1], void 0, function* ({ roomId }, callback) {
        try {
            const router = yield (0, mediasoupServer_1.getRouterForRoom)(roomId);
            callback(router.rtpCapabilities);
        }
        catch (error) {
            console.error("Error getting RTP capabilities:", error);
            callback({ error: "Failed to retrieve RTP capabilities" });
        }
    }));
    // Handle WebRTC transport creation
    socket.on("create-transport", (_a, callback_1) => __awaiter(void 0, [_a, callback_1], void 0, function* ({ roomId }, callback) {
        try {
            const router = yield (0, mediasoupServer_1.getRouterForRoom)(roomId);
            const transport = yield (0, mediasoupServer_1.createWebRtcTransport)(router);
            transport.observer.on("close", () => {
                console.log("Transport closed");
            });
            callback({
                id: transport.id,
                iceParameters: transport.iceParameters,
                iceCandidates: transport.iceCandidates,
                dtlsParameters: transport.dtlsParameters,
            });
        }
        catch (error) {
            console.error("Error creating transport:", error);
            callback({ error: "Failed to create transport" });
        }
    }));
    // Handle transport connection
    socket.on("connect-transport", (_a, callback_1) => __awaiter(void 0, [_a, callback_1], void 0, function* ({ transportId, dtlsParameters }, callback) {
        try {
            const transport = (0, mediasoupServer_1.getTransportById)(transportId);
            if (!transport) {
                throw new Error(`Transport with ID ${transportId} not found`);
            }
            yield transport.connect({ dtlsParameters });
            callback({ success: true });
        }
        catch (error) {
            console.error("Error connecting transport:", error);
            callback({ error: "Failed to connect transport" });
        }
    }));
    // Handle producing media (publishing streams)
    socket.on("produce", (_a, callback_1) => __awaiter(void 0, [_a, callback_1], void 0, function* ({ transportId, kind, rtpParameters, roomId }, callback) {
        try {
            const transport = (0, mediasoupServer_1.getTransportById)(transportId);
            if (!transport) {
                throw new Error(`Transport with ID ${transportId} not found`);
            }
            const producer = yield transport.produce({ kind, rtpParameters });
            producer.observer.on("close", () => {
                console.log("Producer closed");
            });
            callback({ id: producer.id });
            // Notify other participants about the new producer
            socket.to(roomId).emit("new-producer", {
                producerId: producer.id,
                kind: producer.kind,
            });
        }
        catch (error) {
            console.error("Error producing media:", error);
            callback({ error: "Failed to produce" });
        }
    }));
    // Handle consuming media (subscribing to streams)
    socket.on("consume", (_a, callback_1) => __awaiter(void 0, [_a, callback_1], void 0, function* ({ producerId, rtpCapabilities, roomId }, callback) {
        try {
            const router = yield (0, mediasoupServer_1.getRouterForRoom)(roomId);
            if (!router.canConsume({ producerId, rtpCapabilities })) {
                return callback({ error: "Cannot consume" });
            }
            const consumer = yield router.createConsumer({ producerId, rtpCapabilities });
            callback({
                id: consumer.id,
                producerId,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
            });
        }
        catch (error) {
            console.error("Error consuming media:", error);
            callback({ error: "Failed to consume media" });
        }
    }));
    // Disconnect handler
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
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
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
