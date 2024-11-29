import {v4 as uuidv4} from 'uuid'
import { useState, useEffect } from 'react';
import AgoraRTC, { useIsConnected,useJoin } from 'agora-rtc-react';





export default function ConnectAgoraChannel(){

    



    const [channel, setChannel] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [isJoining, setIsJoining] = useState<boolean>(false);
    const isConnected = useIsConnected();
    const [isError, setIsError] = useState<boolean>(false);
  
    const leaveChannel = () => setIsJoining(false);
  
  
    // Join a channel
    const { error, isLoading } = useJoin(
      {
        appid: process.env.AGORA_APPID || "",
        channel:process.env.AGORA_CHANNEL_NAME || "",
        token: process.env.AGORA_TOKEN || "",
        uid:uuidv4()
      },
      isJoining
    );
  
    const onJoin = (channelToJoin: string, tokenToJoin: string) => {
      setChannel(channelToJoin);
      setToken(tokenToJoin);
      setIsJoining(true);
    };
  
    useEffect(() => {
      setIsError(!!error);
    }, [error]);

    console.log(isConnected)





    return (


       <div>
        {
            isConnected ? (<div>'Connected</div>) : (<div>'Not Connected'</div>)
        }




       </div>
    
            

        

    )







   
}