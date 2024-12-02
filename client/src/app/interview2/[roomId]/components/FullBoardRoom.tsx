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
import { useAppSelector } from "@/lib/store/hooks"
import Conference from "./Conference"
import CandidateChats from './CandidateChats'
import {v4 as uuid} from 'uuid'
import { ScrollArea } from "@/components/ui/scroll-area"


//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

// // Suggested questions data
// var suggestedQuestions = [
//   { id: 1, question: "Explain the principles of radar technology.", relevance: "High", topic: "Radar", toughness: 4 },
//   { id: 2, question: "What are the key challenges in developing stealth aircraft?", relevance: "Medium", topic: "Aerospace", toughness: 3 },
//   { id: 3, question: "Describe the process of guided missile trajectory optimization.", relevance: "High", topic: "Missiles", toughness: 5 },
// ]

export default function FullBoardRoom({channel,uid,leaveChannel}) {

  const user = useAppSelector((state)=>state.user)


  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [totalMarks, setTotalMarks] = useState(0)
  const [isAsking,setIsAsking] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    { id: 1, question: "Explain the principles of radar technology.", relevance: "High", topic: "Radar", toughness: 4 },
    { id: 2, question: "What are the key challenges in developing stealth aircraft?", relevance: "Medium", topic: "Aerospace", toughness: 3 },
    { id: 3, question: "Describe the process of guided missile trajectory optimization.", relevance: "High", topic: "Missiles", toughness: 5 },
    { id: 4, question: "How do machine learning models improve predictive maintenance?", relevance: "High", topic: "AI/ML", toughness: 4 },
    { id: 5, question: "What are the environmental impacts of supersonic travel?", relevance: "Medium", topic: "Aerospace", toughness: 3 },
    { id: 6, question: "Discuss the role of composite materials in modern engineering.", relevance: "Medium", topic: "Materials Science", toughness: 2 },
    { id: 7, question: "Explain the working principles of a nuclear reactor.", relevance: "High", topic: "Nuclear Engineering", toughness: 5 },
    { id: 8, question: "What are the primary functions of a flight management system in aviation?", relevance: "High", topic: "Aviation", toughness: 4 },
    { id: 9, question: "How does GPS technology determine location with high precision?", relevance: "High", topic: "Technology", toughness: 3 },
    { id: 10, question: "What advancements are being made in battery technology for electric vehicles?", relevance: "Medium", topic: "Energy", toughness: 3 },
    { id: 11, question: "Explain the role of quantum computing in cryptography.", relevance: "High", topic: "Quantum Computing", toughness: 5 },
    { id: 12, question: "What are the benefits and risks of using CRISPR for genetic editing?", relevance: "High", topic: "Biotechnology", toughness: 4 },
    { id: 13, question: "How does blockchain ensure data security in distributed systems?", relevance: "High", topic: "Blockchain", toughness: 4 },
    { id: 14, question: "Discuss the key steps in the development of space exploration vehicles.", relevance: "High", topic: "Aerospace", toughness: 5 },
    { id: 15, question: "What is the significance of 5G technology in IoT development?", relevance: "Medium", topic: "Telecommunications", toughness: 3 },
    { id: 16, question: "How do autonomous vehicles detect and avoid obstacles?", relevance: "High", topic: "AI/ML", toughness: 4 },
    { id: 17, question: "What are the challenges in designing high-efficiency solar panels?", relevance: "Medium", topic: "Energy", toughness: 3 },
    { id: 18, question: "Explain the concept of virtual reality and its applications in training.", relevance: "High", topic: "Technology", toughness: 3 },
    { id: 19, question: "What methods are used to reduce noise in communication systems?", relevance: "Medium", topic: "Signal Processing", toughness: 3 },
    { id: 20, question: "How is cybersecurity evolving to address modern threats?", relevance: "High", topic: "Cybersecurity", toughness: 4 },
  ]);


  const [answeredQuestions, setAnsweredQuestions] = useState([])


  

  const candidateSkills = ' Biochemical Engineering, Biomedical Engineering, Genomics and Bioinformatics, Nanotechnology, Quantum Computing, Robotics, Agricultural Engineering, Energy Systems (Solar, Wind, Nuclear), Neural Engineering, Synthetic Biology'



  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.API_KEY || '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',
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
            content: `Give 15 interview questions related to these topics in comma separated values,: ${candidateSkills}. The format should be: questionid,question,relevance(high,medium,low),topic,toughness(out of 5) , All these values without spaces. Remove any other text in the response`,
          },
        ],
      });
  
      const responseContent = completion?.choices?.[0]?.message?.content;
      if (!responseContent) {
        throw new Error("No content received from the AI model.");
      }
  
      console.log("Raw Response:", responseContent);
  
      // Function to parse raw data into structured array
      const parseData = (data: string) => {
        try {
          // Split the data by lines, then map each line to structured object
          return data
            .trim() // Remove leading/trailing whitespace
            .split("\n") // Split into lines
            .map((line) => {
              // Split each line by commas and ensure there are no extra spaces
              const [id, question, relevance, topic, toughness] = line.split(",");
              
              if (!id || !question || !relevance || !topic || !toughness) {
                throw new Error(`Invalid data format in line: "${line}"`);
              }
  
              // Return an object with cleaned-up data
              return {
                id: parseInt(id.trim(), 10),
                question: question.trim(),
                relevance: relevance.trim().toLowerCase(),
                topic: topic.trim().toLowerCase(),
                toughness: parseInt(toughness.trim(), 10),
              };
            });
        } catch (error: any) {
          console.error("Error while parsing data:", error.message);
  
        }
      };
  
      // Parse the raw data
      const parsedQuestions = parseData(responseContent);
  
      // Update state with the parsed questions
      setSuggestedQuestions(parsedQuestions);
  
      toast.success('Candidate-specific suggested questions fetched through AI');
  
      if (parsedQuestions.length === 0) {
        console.warn("No valid questions could be parsed from the response.");
      } else {
        console.log("Parsed Questions:", parsedQuestions);
      }
    } catch (error: any) {
      console.error("Error in getSuggestedQuestions:", error.message);
    }
  }
  
  


useEffect(()=>{
  getSuggestedQuestions();
 

},[])
  


useEffect(()=>{
  getSuggestedQuestions();

},[])








  const handleAskQuestion = (question) => {

    setCurrentQuestion(question)
    setPerformanceMetrics(prev => ({
      ...prev,
      questionsAsked: prev.questionsAsked + 1,
    }))
    // Remove the asked question from suggested questions
    setSuggestedQuestions(prev => prev.filter(q => q.id !== question.id))
  }




  const [performanceMetrics, setPerformanceMetrics] = useState({
    questionsAsked: 0,
    skippedQuestions: 0,
    relevance: 0,
    candidateAnxiousness: 0,
    technicalKnowledge: 0,
  })





  return (
    <div className="h-screen bg-background p-4">
      <div className="grid grid-cols-5 gap-4 h-full">
       

        

        {
          user.role=='INTERVIEWER' && 
          <div className="flex flex-col h-[95vh]">
          {/* Scrollable Questions Card */}
          <Card className="flex-1 overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-orange-500 text-lg">Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent className="p-2 h-full">
              <ScrollArea className="h-full overflow-y-auto">
                <div className="space-y-2">
                  {currentQuestion && (
                    <Card className="bg-orange-100 p-2">
                      <p className="text-xs font-semibold">Current Question:</p>
                      <p className="text-sm">{currentQuestion.question}</p>
                    </Card>
                  )}
                  {suggestedQuestions?.map((q) => (
                    <Card key={q.id} className="p-2">
                      <p className="text-xs">{q.question}</p>
                      <div className="flex justify-between items-center mt-1 text-[10px]">
                        <Badge variant="outline" className="text-[10px]">{q.relevance}</Badge>
                        <Badge variant="outline" className="text-[10px]">{q.topic}</Badge>
                        <Badge variant="outline" className="text-[10px]">{q.toughness}/5</Badge>
                      </div>
                      <Button
                        className="w-full mt-1 h-6 text-[10px] bg-gray-800 text-white"
                        variant="outline"
                        onClick={() => handleAskQuestion(q)}
                      >
                        Ask
                      </Button>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        
          {/* Performance Metrics Card */}
          <Card className="">
            <CardHeader className="p-4">
              <CardTitle className="text-orange-500 text-lg">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Questions Asked:</span>
                  <span className="font-semibold">{performanceMetrics.questionsAsked}</span>
                </div>
                <div className="flex justify-between">
                  <span>Skipped Questions:</span>
                  <span className="font-semibold">{performanceMetrics.skippedQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Relevance:</span>
                  <span className="font-semibold">{performanceMetrics.relevance}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Candidate Anxiousness:</span>
                  <span className="font-semibold">{performanceMetrics.candidateAnxiousness}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Technical Knowledge:</span>
                  <span className="font-semibold">{performanceMetrics.technicalKnowledge}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        

        }

      


        <Conference  leaveChannel={leaveChannel}/>
      
       
      


        <CandidateChats currentQuestion={currentQuestion} channel={channel} uid={uid}/>


        




                
      </div>
    </div>
  )
}