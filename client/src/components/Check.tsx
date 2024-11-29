'use client'

import React, { useState, useEffect } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import { AgoraRTCProvider } from 'agora-rtc-react'
import VideoContent from './VideoContent'

const options = {
  appId: 'f1c290c9f1494b18a9515fb615b4b007',
  channel: 'interview',
  token: '007eJxTYNAU63v3T0Vi69JZLfOn7AsPLjR5dfDJ95WnmPdqvzw+2euVAkOaYbKRpUGyZZqhiaVJkqWFoqVpoWlakpmhaZJJkoGB+fkvbukNgYwMQT+XMzEyQCCIz8mQmVeSWlSWmVrOwAAAwhcklw==',
  uid: null,
}

export default function Check() {
  const [client, setClient] = useState<any>(null)

  useEffect(() => {
    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    setClient(agoraClient)
  }, [])

  if (!client) return null

  return (
    <AgoraRTCProvider client={client}>
      <VideoContent />
    </AgoraRTCProvider>
  )
}

