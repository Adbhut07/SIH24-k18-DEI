import AgoraRTC from "agora-rtc-react";

const APP_ID = "8a17f1b47b6043a88cf582896718b905"; // Replace with your Agora App ID

export const useAgora = () => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // Manage local and remote tracks
    let localTracks: any[] = [];
    let remoteUsers: any[] = []; // To store remote users

    const joinChannel = async (
        channelName: string,
        token: string | null,
        uid: string | number
    ): Promise<void> => {
        try {
            // Create tracks (microphone and camera)
            const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
            localTracks = tracks; // Store local tracks in variable
            await client.join(APP_ID, channelName, token || null, uid);
            await client.publish(tracks);

            // Attach local video track to a DOM element
            tracks[1].play("local-player"); // Assuming the video track is at index 1 (microphone is at 0)

            // Set up a listener for remote users publishing their video
            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                if (mediaType === "video") {
                    // Attach remote video track to a DOM element
                    user.videoTrack?.play(`remote-player-${user.uid}`);
                    remoteUsers.push(user);
                }
            });

            client.on("network-quality", (stats) => {
                console.log("Downlink Network Quality:", stats.downlinkNetworkQuality);
                console.log("Uplink Network Quality:", stats.uplinkNetworkQuality);
            });
            

            // Set up a listener for remote users leaving the channel
            client.on("user-unpublished", (user, mediaType) => {
                if (mediaType === "video") {
                    // Remove the remote video stream when the user leaves
                    const element = document.getElementById(`remote-player-${user.uid}`);
                    if (element) element.remove();
                    remoteUsers = remoteUsers.filter(u => u.uid !== user.uid);
                }
            });

        } catch (error) {
            console.error("Error joining channel:", error);
        }
    };

    const leaveChannel = async (): Promise<void> => {
        try {
            // Close the local tracks
            localTracks.forEach((track) => track.close());
            localTracks = [];
            await client.leave();

            // Remove all remote user video elements
            remoteUsers.forEach(user => {
                const element = document.getElementById(`remote-player-${user.uid}`);
                if (element) element.remove();
            });

            remoteUsers = []; // Clear remote users
        } catch (error) {
            console.error("Error leaving channel:", error);
        }
    };

    const toggleAudio = async () => {
        if (localTracks[0].muted) {
            await localTracks[0].setMuted(false);
        } else {
            await localTracks[0].setMuted(true);
        }
    };
    
    const toggleVideo = async () => {
        if (localTracks[1].muted) {
            await localTracks[1].setMuted(false);
        } else {
            await localTracks[1].setMuted(true);
        }
    };
    
    return { client, joinChannel, leaveChannel, toggleAudio, toggleVideo };
    
};