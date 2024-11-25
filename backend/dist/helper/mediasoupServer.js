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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRouter = exports.getTransportById = exports.createWebRtcTransport = exports.getRouterForRoom = exports.createMediasoupWorker = void 0;
const mediasoup_1 = require("mediasoup");
const mediasoupConfig_1 = require("./mediasoupConfig");
let worker; // Mediasoup Worker
const roomRouters = new Map(); // Store routers for each room
const createMediasoupWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    worker = yield (0, mediasoup_1.createWorker)(mediasoupConfig_1.mediasoupConfig.worker);
    console.log('Mediasoup worker created');
    worker.on('died', () => {
        console.error('Mediasoup worker has died');
        process.exit(1);
    });
});
exports.createMediasoupWorker = createMediasoupWorker;
// Create a router for a specific room
const getRouterForRoom = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!roomRouters.has(roomId)) {
        const router = yield worker.createRouter({ mediaCodecs: mediasoupConfig_1.mediasoupConfig.router.mediaCodecs });
        roomRouters.set(roomId, router);
        console.log(`Router created for room: ${roomId}`);
    }
    return roomRouters.get(roomId);
});
exports.getRouterForRoom = getRouterForRoom;
const transports = new Map();
const createWebRtcTransport = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const router = yield (0, exports.getRouterForRoom)(roomId);
        const transport = yield router.createWebRtcTransport(mediasoupConfig_1.mediasoupConfig.webRtcTransport);
        transports.set(transport.id, transport);
        return transport;
    }
    catch (error) {
        console.error('Error creating WebRTC Transport:', error);
        throw error;
    }
});
exports.createWebRtcTransport = createWebRtcTransport;
const getTransportById = (id) => {
    return transports.get(id);
};
exports.getTransportById = getTransportById;
const getRouter = () => worker.createRouter({ mediaCodecs: mediasoupConfig_1.mediasoupConfig.router.mediaCodecs });
exports.getRouter = getRouter;
