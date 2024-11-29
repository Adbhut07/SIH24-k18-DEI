
'use client'
import Meet from "@/components/Meet"
import { AgoraRTCProvider } from "agora-rtc-react"
import AgoraRTC from "agora-rtc-react";


export default function check(){
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    if (!client) return <div>'Rtc not connected'</div>

    return (
        <AgoraRTCProvider client={client}>
        <Meet />
      </AgoraRTCProvider>
    )
}

