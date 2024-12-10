"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Video, VideoOff, MessageSquare, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import Webcam from 'react-webcam'
import OpenAI from 'openai'
import { useEffect } from "react"
import AgoraRTC, { AgoraRTCProvider, useIsConnected, useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRemoteUsers } from "agora-rtc-react";
import {v4 as uuidv4} from 'uuid'
import ConnectAgoraChannel from "./components/ConnectAgoraChannel"
import Client from '@/components/Client'


AgoraRTC.createClient({ mode: "live", codec: "h264" });

const  InterviewBoardroom = ()=> {


  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [totalMarks, setTotalMarks] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState([])
  const [isAsking,setIsAsking] = useState(false);
  const [suggestedQuestions,setSuggestedQuestions] = useState([{ id: 1, question: "Explain the principles of radar technology.", relevance: "High", topic: "Radar", toughness: 4 },
    { id: 2, question: "What are the key challenges in developing stealth aircraft?", relevance: "Medium", topic: "Aerospace", toughness: 3 },
    { id: 3, question: "Describe the process of guided missile trajectory optimization.", relevance: "High", topic: "Missiles", toughness: 5 },
  ])

  const candidateSkills = ' Biochemical Engineering, Biomedical Engineering, Genomics and Bioinformatics, Nanotechnology, Quantum Computing, Robotics, Agricultural Engineering, Energy Systems (Solar, Wind, Nuclear), Neural Engineering, Synthetic Biology'



  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true
  })


  
  async function getSuggestedQuestions() {
    try {
      // Call OpenAI API to fetch suggested questions
      const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [
          {
            role: "user",
            content: `Do not give extra data other than asked  Give 15 interview questions related to these topics in comma separated values,: ${candidateSkills}. The format should be: questionid,question,relevance(high,medium,low),topic,toughness(out of 5)`,
          },
        ],
      });
  
      const responseContent = completion?.choices?.[0]?.message?.content;
      if (!responseContent) {
        throw new Error("No content received from the AI model.");
      }
  
      console.log("Raw Response:", responseContent);
  
      // Function to parse raw data into structured array
      const parseData = (data:any) => {
        try {
          return data
            .trim() // Remove leading/trailing whitespace
            .split("\n") // Split into lines
            .map((line:any) => {
              const [id, question, relevance,topic,toughness] = line.split(",");
              if (!id || !question || !relevance || !topic || !toughness) {
                throw new Error(`Invalid data format in line: "${line}"`);
              }
              return {
                id: parseInt(id.trim(), 10),
                question: question.trim(),
                relevance: relevance.trim().toLowerCase(),
                topic: topic.trim().toLowerCase(),
                toughness: parseInt(toughness.trim(), 10),
              };
            });
        } catch (error:any) {
          console.error("Error while parsing data:", error.message);
          return [];
        }
      };
  
      // Parse the raw data
      setSuggestedQuestions(parseData(responseContent));
  
      if (suggestedQuestions.length === 0) {
        console.warn("No valid questions could be parsed from the response.");
      } else {
        console.log("Parsed Questions:", suggestedQuestions);
      }
  
      return suggestedQuestions; // Return the parsed questions
    } catch (error:any) {
      console.error("Error in getSuggestedQuestions:", error.message);
      return []; // Return an empty array on failure
    }
  }


useEffect(()=>{
  // getSuggestedQuestions();

},[])



  const handleAskQuestion = (question) => {
    setCurrentQuestion(question)
  }

  const handleMarkQuestion = (marks) => {
    setTotalMarks(totalMarks + marks)
    setAnsweredQuestions([...answeredQuestions, { question: currentQuestion.question, marks }])
    
    setSuggestedQuestions(suggestedQuestions.filter((item,)=>item['id'] != currentQuestion.id))
    setCurrentQuestion("")
  }

  



  return (
     <div>

     
     
    <div className="h-screen bg-background p-4">
      <div className="grid grid-cols-5 gap-4 h-full">
        {/* Left Section - Suggested Questions */}
        <Card className="col-span-1 overflow-auto">
          <CardHeader>
            <CardTitle className="text-blue-500">Suggested Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentQuestion && (
                <div className="bg-muted p-2 rounded">
                  <h3 className="font-semibold">Current Question:</h3>
                  <p>{currentQuestion.question}</p>
                </div>
              )}
              {suggestedQuestions.map((q) => (
                <Card key={q.id} className="p-2">
                  <p className="text-sm">{q.question}</p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="outline">{q.relevance}</Badge>
                    <Badge variant="outline">{q.topic}</Badge>
                    <Badge variant="outline"> {Number(q.toughness)}/5</Badge>
                  </div>
                  <Button className="w-full mt-2" onClick={() => handleAskQuestion(q)}>Ask</Button>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Middle Section - Camera Views */}
        <Card className="col-span-3 ">
          <CardContent className="p-4 ">
            {/* <div className="grid grid-rows-2 gap-4 h-[90vh] bg-blue-500">
              <div className="bg-muted aspect-video rounded-lg flex items-center justify-center  ">
                <p className="text-muted-foreground">Interviewer Camera</p>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full mt-1 ">
              <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Candidate </p>
              </div>
              <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Interviewer 2</p>
              </div>
              <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Interviewer 3</p>
              </div>

            </div>

            </div> */}

            <div className=" h-[75vh] flex flex-col" >
               <div className="w-full h-[70%] bg-muted aspect-video rounded-lg flex items-center justify-center overflow-hidden">
                {/* <p className="text-muted-foreground">Interviewer</p> */}
                {/* <Webcam height={720} width={1280} /> */}
                
                </div>

               <div className="flex h-[25vh] gap-1  justify-between border-2 items-center p-2">

                <div className="bg-muted h-full  aspect-video rounded-lg flex items-center justify-center overflow-hidden">
                {/* <Webcam height={720} width={1280} /> */}
                </div>

                <div className="bg-muted h-full  aspect-video rounded-lg flex items-center justify-center overflow-hidden">
                {/* <Webcam height={720} width={1280} /> */}
                </div>
                <div className="bg-muted h-full  aspect-video rounded-lg flex items-center justify-center overflow-hidden">
                {/* <Webcam height={720} width={1280} /> */}
                </div>
                

               </div>


            </div>


            
           

            

            <div className="">

              <div className="flex justify-center space-x-4 mt-4">
                <Button className="bg-blue-100" variant="outline" size="icon"><Mic className="h-4 w-4" /></Button>
                {/* <Button variant="outline" size="icon"><MicOff className="h-4 w-4" /></Button> */}
                <Button className="bg-blue-200" variant="outline" size="icon"><Video className="h-4 w-4" /></Button>
                {/* <Button variant="outline" size="icon"><VideoOff className="h-4 w-4" /></Button> */}
                <Button className="bg-blue-100" variant="outline" size="icon"><MessageSquare className="h-4 w-4" /></Button>
                <Button className="bg-blue-200" variant="outline" size="icon"><HelpCircle className="h-4 w-4" /></Button>
              </div>
              {currentQuestion && (
                <div className="mt-4 flex justify-center gap-2">
                  <Button onClick={() => handleMarkQuestion(3)}><ThumbsUp className="mr-2 h-4 w-4" /> Excellent (3 mark)</Button>
                  <Button onClick={() => handleMarkQuestion(2)}><ThumbsUp className="mr-2 h-4 w-4" /> Good (2 mark)</Button>
                  <Button onClick={() => handleMarkQuestion(1)}><ThumbsUp className="mr-2 h-4 w-4" /> Average (1 marks)</Button>
                  <Button onClick={() => handleMarkQuestion(0)}><ThumbsUp className="mr-2 h-4 w-4" /> Poor (0 mark)</Button>
                </div>
              )}


            </div>


          </CardContent>
        </Card>

        {/* Right Section - Analytics */}
        <Card className="col-span-1 overflow-auto">
          <CardHeader >
            <div className="flex justify-between">
              <CardTitle className="font-bold">Analytics</CardTitle>
              <Badge className="bg-red-500 text-white" variant="outline">● Live</Badge>
            </div>

          </CardHeader>

          <CardContent>
            <div className="flex h-auto p-2 items-center border rounded-lg shadow-lg gap-4 bg-white">
              {/* Avatar Section */}
              <Avatar>
                <AvatarImage
                  className="rounded-full"
                  width={30}
                  height={30}
                  src="https://github.com/shadcn.png"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              {/* Content Section */}
              <div className="flex flex-col text-sm ">
                <div className="font-semibold text-sm text-gray-800">Diya Goyal</div>
                <div className="text-gray-600">Experience: <span className="font-medium">32+ years</span></div>
                <div className="text-gray-600">Designation: <span className="font-medium">Manager</span></div>
                <div className="text-gray-600">Worked At: <span className="font-medium">Google</span></div>
              </div>
            </div>
          </CardContent>



          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle className="font-bold text-blue-500">Statistics</AlertTitle>
            <AlertDescription>
              Overall Accuracy: 52%
            </AlertDescription>
            <AlertDescription>
              Overall Relevancy: 52%
            </AlertDescription>
            <AlertDescription>
              Overall Performance: Good
            </AlertDescription>
          </Alert>


          <CardContent className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Total Marks:</h3>
                <p className="text-2xl font-bold">{totalMarks}</p>
              </div>
              <div>
                <h3 className="font-semibold">Questions Answered:</h3>
                <p>{answeredQuestions.length}</p>
              </div>
              <div>
                <h3 className="font-semibold">Performance:</h3>
                <Progress value={totalMarks / (answeredQuestions.length || 1) * 100} className="mt-2" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-500">Recent Questions:</h3>
                <ul className="list-disc list-inside">
                  {answeredQuestions.slice(-5).reverse().map((q, index) => (
                    <li key={index} className="text-sm">
                      {q.question} - {q.marks} mark{q.marks !== 1 ? 's' : ''}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    

</div>

</div>









   
  )
}

export default InterviewBoardroom





