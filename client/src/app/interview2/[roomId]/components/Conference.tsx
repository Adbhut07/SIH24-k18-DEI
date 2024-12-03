import { Card, CardContent } from "@/components/ui/card";
import { LocalUser, useCurrentUID, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish } from "agora-rtc-react";
import { MicOff } from "lucide-react";
import { useState } from "react";
import RemoteUsers from "./RemoteUsers";
import UserControls from "./UserControls";
import { useAppSelector } from "@/lib/store/hooks";



export default function Conference({leaveChannel}) {

    const user = useAppSelector((state)=>state.user)

    // Local User controls
    const [micOn, setMicOn] = useState<boolean>(true);
    const [cameraOn, setCameraOn] = useState<boolean>(true);
    // Create a mic and camera track
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
    const { localCameraTrack } = useLocalCameraTrack(cameraOn);

    // Publish the mic and camera track for the local user
    usePublish([localCameraTrack, localMicrophoneTrack]);

    const uid = useCurrentUID()
    console.log('User ', uid)


    

    



    return (

            
            <Card className={`grid ${user.role=="CANDIDATE"?"col-span-4":"col-span-3"}`}>
                <CardContent className="p-4 ">


                    <div className=" h-[75vh] flex flex-col" >
                        <div className="w-full h-[70%] bg-muted aspect-video rounded-lg flex items-center justify-center overflow-hidden">
                            { (localCameraTrack?.muted) && <p className="text-muted-foreground">Interviewer</p>}

                            <div className="h-full w-full">
                                <LocalUser
                                    audioTrack={localMicrophoneTrack}
                                    videoTrack={localCameraTrack}
                                    micOn={micOn}
                                    playAudio={false}
                                    playVideo={cameraOn}
                                    cameraOn={cameraOn}
                                >
                                    <samp className="bg-black text-white px-1 text-sm bottom-0 absolute flex">
                                        {uid}
                                        {!micOn && (
                                            <MicOff className="text-red-600 self-center ml-1" size={14} />
                                        )}
                                    </samp>
                                </LocalUser>
                            </div>


                        </div>


                        <RemoteUsers/>

                    </div>


                </CardContent>

                <UserControls
        micOn={micOn}
        setMicOn={setMicOn}
        cameraOn={cameraOn}
        setCameraOn={setCameraOn}
        leaveChannel={leaveChannel}
      />

            </Card>





        
    )
}