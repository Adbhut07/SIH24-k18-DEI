"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediasoupConfig = void 0;
exports.mediasoupConfig = {
    worker: {
        rtcMinPort: 40000,
        rtcMaxPort: 49999,
        logLevel: 'warn',
        logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'], // These are fine
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
