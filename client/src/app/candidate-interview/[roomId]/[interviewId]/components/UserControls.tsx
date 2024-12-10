'use client'

import { MicOff, Mic, CameraOff, Camera, PhoneOff } from 'lucide-react'
import { Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type UserControlsProps = {
  cameraOn: boolean
  setCameraOn: Dispatch<SetStateAction<boolean>>
  micOn: boolean
  setMicOn: Dispatch<SetStateAction<boolean>>
  leaveChannel: () => void
}

const UserControls = ({
  micOn,
  setMicOn,
  cameraOn,
  setCameraOn,
  leaveChannel,
}: UserControlsProps) => {
  return (
    <TooltipProvider>
      <div className="flex gap-4 justify-center m-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setMicOn((prevState) => !prevState)}
              aria-label="Toggle microphone"
              className={micOn ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{micOn ? "Turn off microphone" : "Turn on microphone"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setCameraOn((prevState) => !prevState)}
              aria-label="Toggle camera"
              className={cameraOn ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
            >
              {cameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{cameraOn ? "Turn off camera" : "Turn on camera"}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={leaveChannel}
              aria-label="Leave channel"
            >
              <PhoneOff className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Leave channel</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export default UserControls

