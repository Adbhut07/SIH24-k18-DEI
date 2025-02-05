import { useIsConnected, useJoin } from "agora-rtc-react";
import { useEffect, useState } from "react";
import {v4 as uuidv4} from 'uuid'
import Conference from "./Conference";
import JoinRoom from "./JoinRoom"
import FullBoardRoom from "./FullBoardRoom";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";



export default function Details(){

  const {roomId} = useParams();
  const user = useAppSelector((state)=>state.user)


 



  




    const [token, setToken] = useState<string>("");
    const [isJoining, setIsJoining] = useState<boolean>(false);
    const isConnected = useIsConnected()
    const [isError, setIsError] = useState<boolean>(false);
    const [channel,setChannel] = useState("")
    const [appId,setAppId] = useState('')
    const [uid,setUid] = useState<number>(123)
  
    const leaveChannel = () => setIsJoining(false);

  
  
    // Join a channel
    const { error, isLoading } = useJoin(
      {
        appid: appId,
        channel:channel,
        token:token,
        uid:Number(uid)
      },
      isJoining
    );
  
    const onJoin = (channelToJoin: string, tokenToJoin: string, appIdToJoin:string, uidToJoin:number) => {
      setChannel(channelToJoin);
      setToken(tokenToJoin);
      setAppId(appIdToJoin)
      setUid(uidToJoin)
      setIsJoining(true);
    };
  
    useEffect(() => {
      setIsError(!!error);
    }, [error]);


  






    return (

        <div>
            {
                isConnected?(
                    <FullBoardRoom channel={channel} uid={uid} leaveChannel={leaveChannel} />

                ):(
                  <JoinRoom
                  onJoin={onJoin}
                  isError={!!error || isError}
                  setIsError={setIsError}
                  isLoading={isLoading}
                  
                  />
                )
            }
            
        </div>


    )
}