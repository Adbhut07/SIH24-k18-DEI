import { useIsConnected, useJoin } from "agora-rtc-react";
import { useEffect, useState } from "react";
import {v4 as uuidv4} from 'uuid'
import Conference from "./Conference";
import JoinRoom from "./JoinRoom"
import { useParams } from "next/navigation";
import FullBoardRoom from "./FullBoardRoom";



export default function Details(){

    const {channelName} = useParams()
    console.log(channelName)

    const [channel, setChannel] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [isJoining, setIsJoining] = useState<boolean>(false);
    const isConnected = useIsConnected()
    const [isError, setIsError] = useState<boolean>(false);
  
    const leaveChannel = () => setIsJoining(false);

  
  
    // Join a channel
    const { error, isLoading } = useJoin(
      {
        appid: 'f1c290c9f1494b18a9515fb615b4b007',
        channel:'interview',
        token:'007eJxTYNi7yJ21ut0+0O/Jwfw3cjcmKoe9MXxhVTyhhIWZc6+KSJ4CQ5phspGlQbJlmqGJpUmSoUWipamhaVqSmaFpkkmSgYF5WIVHekMgI4P1VClWRgYIBPE5GTLzSlKLyjJTyxkYAC+iHks=',
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


  






    return (

        <div>
            {
                isConnected?(
                    <FullBoardRoom leaveChannel={leaveChannel} />

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