'use client';  

import React, { useEffect, useRef, useState } from 'react';
import { Device, types as mediasoupClientTypes } from 'mediasoup-client';
import { Socket, io } from 'socket.io-client';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';

const VideoChat = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [device, setDevice] = useState<Device | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Connect to the server
        const newSocket = io('http://localhost:5454', {
            withCredentials: true
        });
        
        setSocket(newSocket);

        // Initialize MediaSoup device
        const initDevice = async () => {
            try {
                const device = new Device();
                
                // Get router RTP capabilities
                const routerRtpCapabilities = await new Promise<RtpCapabilities>((resolve) => {
                    newSocket.emit('get-rtp-capabilities', {}, resolve);
                });

                // Load the device with the router's RTP capabilities
                await device.load({ routerRtpCapabilities });
                setDevice(device);

                // Get local media stream
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setLocalStream(stream);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error initializing device:', error);
            }
        };

        initDevice();

        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            newSocket.close();
        };
    }, []);

    const startPublishing = async () => {
        if (!socket || !device || !localStream) return;

        try {
            // Create send transport
            const transportInfo = await new Promise((resolve) => {
                socket.emit('create-transport', {}, resolve);
            });

            const sendTransport = device.createSendTransport(transportInfo as mediasoupClientTypes.TransportOptions);

            // Handle transport connection
            sendTransport.on('connect', async ({ dtlsParameters }, callback) => {
                socket.emit('connect-transport', {
                    transportId: sendTransport.id,
                    dtlsParameters
                }, callback);
            });

            // Handle producer creation
            sendTransport.on('produce', async ({ kind, rtpParameters }, callback) => {
                socket.emit('produce', {
                    transportId: sendTransport.id,
                    kind,
                    rtpParameters
                }, ({ id }: { id: string }) => {
                    callback({ id });
                });
            });

            // Start publishing tracks
            for (const track of localStream.getTracks()) {
                await sendTransport.produce({ track });
            }
        } catch (error) {
            console.error('Error starting publisher:', error);
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">Video Chat</h2>
                <button
                    onClick={startPublishing}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Start Publishing
                </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-bold mb-2">Local Video</h3>
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <h3 className="font-bold mb-2">Remote Video</h3>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full border border-gray-300 rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default VideoChat;