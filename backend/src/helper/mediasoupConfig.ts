import { WorkerLogLevel, WorkerLogTag } from "mediasoup/node/lib/types";

export const mediasoupConfig = {
    worker: {
        rtcMinPort: 40000,
        rtcMaxPort: 49999,
        logLevel: 'warn' as WorkerLogLevel,
        logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'] as WorkerLogTag[], // These are fine
    },
    router: {
        mediaCodecs: [
            {
                kind: 'audio',
                mimeType: 'audio/opus',
                clockRate: 48000,
                channels: 2,
            },
            {
                kind: 'video',
                mimeType: 'video/VP8',
                clockRate: 90000,
                parameters: {
                    'x-google-start-bitrate': 1000,
                },
            },
        ],
    },
    webRtcTransport: {
        listenIps: [{ ip: '0.0.0.0', announcedIp: null }], // Replace `null` with your public IP for production
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
    },
};
