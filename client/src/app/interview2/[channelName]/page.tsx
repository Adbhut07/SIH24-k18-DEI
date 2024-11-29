'use client'

import { useParams } from "next/navigation"
import Call from "./components/Call"


export default function InterviewPage(){

    const {channelName} = useParams()

    


    return (

        <div>

            

        <Call/>

        


        </div>
    )
}