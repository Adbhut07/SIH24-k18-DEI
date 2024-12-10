'use client';
import React, { useState, useEffect } from "react";
import { useAgora } from "../../hooks/useAgora";

const VideoCall = () => {
  const { client, joinChannel, leaveChannel, toggleAudio, toggleVideo } = useAgora();
    const [channelName, setChannelName] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [uid, setUid] = useState<number>(Math.floor(Math.random() * 1000));
    const [remoteUsers, setRemoteUsers] = useState<any[]>([]); // To store remote users

    useEffect(() => {
        // Cleanup when component unmounts
        return () => {
            leaveChannel();
        };
    }, []);

    // Fetch token from the backend
    const fetchToken = async (channelName: string, role: 'publisher' | 'subscriber') => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/auth/generate-token?channelName=${channelName}&uid=${uid}&role=${role}`
            );
            const data = await response.json();
            setToken(data.token);
        } catch (error) {
            console.error("Error fetching token:", error);
        }
    };

    // Handle the user joining the channel
    const handleJoin = async () => {
        if (channelName && token) {
            await joinChannel(channelName, token, uid);
        } else {
            console.error("Channel name or token is missing");
        }
    };

    // Handle the user leaving the channel
    const handleLeave = async () => {
        await leaveChannel();
        setRemoteUsers([]); // Clear remote users when leaving the channel
    };

    // Handle remote users joining
    const handleUserPublished = (user: any, mediaType: string) => {
        if (mediaType === 'video') {
            client.subscribe(user, mediaType).then(() => {
                user.videoTrack?.play(`remote-player-${user.uid}`);
                setRemoteUsers(prev => [...prev, user]);
            });
        }
    };

    // Handle remote users leaving
    const handleUserUnpublished = (user: any) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    };

    // Set up event listeners for remote users
    useEffect(() => {
        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);

        return () => {
            client.off("user-published", handleUserPublished);
            client.off("user-unpublished", handleUserUnpublished);
        };
    }, [client]);

    return (
        <div className="video-call-container">
            <h1 className="header">Agora Video Call</h1>
            
            <div className="channel-name-container">
                <input
                    type="text"
                    className="input"
                    placeholder="Enter Channel Name"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                />
                <button className="button" onClick={() => fetchToken(channelName, 'publisher')}>Get Token</button>
            </div>

            <div className="controls">
              <button className="button" onClick={handleJoin}>Join Channel</button>
              <div></div>
              <button className="button" onClick={handleLeave}>Leave Channel</button>
              <div></div>
              <button className="button" onClick={toggleAudio}>Toggle Audio</button>
              <div></div>
              <button className="button" onClick={toggleVideo}>Toggle Video</button>
            </div>

            <div className="video-container">
                {/* Local Video */}
                <div id="local-player" className="local-video">
                    {/* Local user's video will be placed here */}
                    
                </div>

                {/* Remote Video */}
                <div id="remote-videos" className="remote-videos">
    {remoteUsers.map((user) => (
        <div key={user.uid} id={`remote-player-${user.uid}`} className="remote-video">
            <p>User {user.uid}</p>
            {/* Remote user's video will be placed here */}
        </div>
    ))}
</div>

            </div>
        </div>
    );
};

export default VideoCall;
