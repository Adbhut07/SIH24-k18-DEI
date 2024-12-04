"use client" 

import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";
import Conference from "./Details";
import Details from "./Details";



export default function Call(){

const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));


  return (
    <AgoraRTCProvider client={client}>
       
        <Details/>
      
    </AgoraRTCProvider>
  );
}