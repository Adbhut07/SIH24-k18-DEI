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
exports.getRouter = exports.getTransportById = exports.createWebRtcTransport = exports.createMediasoupWorker = void 0;
const mediasoup_1 = require("mediasoup");
const mediasoupConfig_1 = require("./mediasoupConfig");
let worker; // Mediasoup Worker
let router; // Mediasoup Router
const createMediasoupWorker = () => __awaiter(void 0, void 0, void 0, function* () {
    worker = yield (0, mediasoup_1.createWorker)(mediasoupConfig_1.mediasoupConfig.worker);
    console.log('Mediasoup worker created');
    worker.on('died', () => {
        console.error('Mediasoup worker has died');
        process.exit(1);
    });
    router = yield worker.createRouter({ mediaCodecs: mediasoupConfig_1.mediasoupConfig.router.mediaCodecs });
    console.log('Router created');
});
exports.createMediasoupWorker = createMediasoupWorker;
const transports = new Map();
const createWebRtcTransport = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
const getRouter = () => router;
exports.getRouter = getRouter;
