import { createWorker } from 'mediasoup';
import { mediasoupConfig } from './mediasoupConfig';

let worker: any; // Mediasoup Worker
const roomRouters: Map<string, any> = new Map(); // Store routers for each room

export const createMediasoupWorker = async () => {
    worker = await createWorker(mediasoupConfig.worker);
    console.log('Mediasoup worker created');

    worker.on('died', () => {
        console.error('Mediasoup worker has died');
        process.exit(1);
    });
};

// Create a router for a specific room
export const getRouterForRoom = async (roomId: string): Promise<any> => {
    if (!roomRouters.has(roomId)) {
        const router = await worker.createRouter({ mediaCodecs: mediasoupConfig.router.mediaCodecs });
        roomRouters.set(roomId, router);
        console.log(`Router created for room: ${roomId}`);
    }
    return roomRouters.get(roomId);
};

const transports = new Map<string, any>();

export const createWebRtcTransport = async (roomId: string): Promise<any> => {
    try {
        const router = await getRouterForRoom(roomId);
        const transport = await router.createWebRtcTransport(mediasoupConfig.webRtcTransport);
        transports.set(transport.id, transport);
        return transport;
    } catch (error) {
        console.error('Error creating WebRTC Transport:', error);
        throw error;
    }
};

export const getTransportById = (id: string): any | undefined => {
    return transports.get(id);
};

export const getRouter = () => worker.createRouter({ mediaCodecs: mediasoupConfig.router.mediaCodecs });
