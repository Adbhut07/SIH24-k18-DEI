"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Video, VideoOff, MessageSquare, ThumbsUp, ThumbsDown, HelpCircle, Loader2 } from 'lucide-react'
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
import { useParams } from "next/navigation"
import toast from "react-hot-toast"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { set } from "date-fns"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedSkills } from "./animated-skills"
import useWebSocket from "@/hooks/useWebSocket"
import re from 're'
import json from 'json'
import Papa from 'papaparse';

export default function FullBoardRoom({channel,uid,leaveChannel}) {
  
  //connection to python server  for AI
  const { initializeWebSocket, getEvaluatedDataFromAI, isConnected, connectionError } = useWebSocket();

  useEffect(() => {
    initializeWebSocket();
  }, [initializeWebSocket]);


  

  const user = useAppSelector((state)=>state.user)

  const {roomId,interviewId} = useParams();


  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [totalMarks, setTotalMarks] = useState(0)
  const [isAsking,setIsAsking] = useState(false);
  const [currentMarks, setCurrentMarks] = useState('')
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  const [isSubmittingMarks, setIsSubmittingMarks] = useState(false)
  const [isSubmittingEvaluation, setIsSubmittingEvaluation] = useState(false)
  const [currentCandidateAnswer,setCurrentCandidateAnswer] = useState('')

  const [candidateEmail,setCandidateEmail] = useState('')
  const [candidateSkills,setCandidateSkills] = useState([])






  const [answeredQuestions, setAnsweredQuestions] = useState([])
  const [isRecording, setIsRecording] = useState(false)

  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
} = useSpeechRecognition()



const fetchCandidateSkills = async ()=>{

  try{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/userProfile/${candidateEmail}`,)
    console.log(response?.data?.data?.skills)

    setCandidateSkills(response?.data?.data?.skills)

  }
  catch(error){
    console.log(error)
  }
}



 const fetchInterviewDetails = async () => {

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/interview/interviews/${interviewId}`);
    setCandidateEmail(response?.data?.data?.candidate?.email)
    console.log(response?.data?.data?.candidate?.email)
    
  } catch (error) {
    console.log(error)
    
  }


 }






  // Candidate skills (replace with actual skills)
  // const candidateSkills = "JavaScript, React, Node.js, SQL, Data Structures";


  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  })

  
  async function getSuggestedQuestions() {

    const skills = candidateSkills.join(', ');

    const prompt = `Generate a set of 15 interview questions related to ${skills} Format the response as a JSON array where each element is an object with the following structure:
{
  "id": [unique integer from 1 to 15],
  "question": [string containing the interview question],
  "topic": [string indicating the specific topic],
  "relevance": ["high", "medium", or "low"],
  "toughness": [integer between 1 and 5],
  "difficulty": ["easy", "intermediate", or "hard"],
  "category": [string representing a subfield],
  "ai_ans": [detailed AI-generated answer (3-5 sentences), with properly escaped characters]
}
Ensure all questions are directly related to Python programming, data analysis, or machine learning, and cover a range of subtopics within these skills. Provide diverse question types (technical, conceptual, scenario-based). Format the JSON correctly, with no errors.

`;

try {
  // Call OpenAI API to fetch suggested questions
  const completion = await openai.chat.completions.create({
    model: "meta-llama/llama-3.2-3b-instruct:free",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  let responseContent = completion?.choices?.[0]?.message?.content;

  // Check if content is received from the AI model
  if (!responseContent) {
    throw new Error("No content received from the AI model.");
  }

  // Log the response to check for correctness
  console.log("AI Response:", responseContent);


  const firstIndex = String(responseContent).indexOf('[')
  const secondIndex = String(responseContent).indexOf(']')
  responseContent = responseContent.slice(firstIndex,secondIndex+1)

  // Attempt to parse the response content into JSON
  try {
    const parsedQuestions = JSON.parse(responseContent);

    // Check if the parsed data is an array and contains the expected structure
    if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
      console.log("Parsed Questions:", parsedQuestions);
      // Optionally update state or perform further actions with the parsed questions
      setSuggestedQuestions(parsedQuestions);
    } else {
      console.warn("Parsed content is not in the expected array format or is empty.");
    }
  } catch (jsonError) {
    console.error("Error parsing JSON response:", jsonError.message);
  }

} catch (error: any) {
  console.error("Error in getSuggestedQuestions:", error.message);
}
  }








if (user.role == 'INTERVIEWER'){
  useEffect(()=>{
    fetchInterviewDetails()
  
  },[])

}

useEffect(()=>{
  if (candidateEmail){
    fetchCandidateSkills()
  }


},[candidateEmail])

useEffect(()=>{
  if (candidateSkills.length>0){
    getSuggestedQuestions()
  }
},[candidateSkills])




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

  const handleCurrentQuestionEvaluation = async () => {
    setIsSubmittingMarks(true)

    console.log("Current candidate answer",currentCandidateAnswer)
   

    // const currentEvaluation = {
    //   question: currentQuestion?.question,
    //   ideal_ans: currentQuestion?.ai_answer,
    //   candidate_ans:currentCandidateAnswer || "not answered",
    //   toughness: Number(currentQuestion?.toughness || 0),
    //   relevancy: currentQuestion?.relevance,
    //   category: currentQuestion?.category,
    //   topic: currentQuestion?.topic,
    //   feedback_ai: "not given",
    //   marks_given_by_interviewers: [
    //     {
    //       interviewerId: user.id,
    //       score: Number(currentMarks),
    //     },
    //   ],
    // }

    const data = {
      question: currentQuestion?.question,
      candidate_skills: candidateSkills?.join(', '),
      candidate_ans: currentCandidateAnswer || "not answered",
    };

    const response = await getEvaluatedDataFromAI(data);
    console.log("Evaluation Result:", response);

    let currentEvaluation = {...response,question:currentQuestion?.question,candidate_ans:currentCandidateAnswer || "not answered",marks_given_by_interviewers: [
      {
        interviewerId: user.id,
        score: Number(currentMarks),
      },
    ]}


    setAnsweredQuestions((prev)=>[...prev,currentEvaluation])
    setCurrentMarks(0);
    setCurrentQuestion(null)
    setCurrentCandidateAnswer('')

    setIsSubmittingMarks(false)
  }

  const handleSubmitEvaluations = async () => { 
    setIsSubmittingEvaluation(true)

    const data = {
      questionDetails: [
        ...answeredQuestions
      ],
    };
    try{
  
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/evaluation/${interviewId}/question-details`,data,{
        withCredentials:true
      })

      console.log("evaluated" ,response)
      toast.success('Evaluation submitted successfully!')
  
    }
    catch(error){
      console.log(error)
      toast.error('Failed to submit evaluation!')
    }
    finally{
      setIsSubmittingEvaluation(false)
    }


  }

  const handleInputMarks = (e) => {

    const value = e.target.value;
    if (value<=10 || value==""){
      setCurrentMarks(value)
    }
  

  }

  const handleStartAsking = ()=>{
    setIsRecording(true)
        resetTranscript()
        SpeechRecognition.startListening({ continuous: true })

  }

  const handleStopAsking  = ()=>{
    setIsRecording(false)
        SpeechRecognition.stopListening()

        let askedQuestion = {
          
            id: uuid(),
            question: transcript,
            ideal_ans: "not fetched",
            category: "none",
            difficulty: 0,
            relevance: "none",
            topic: "none",
            toughness: 0
          
        }

        setCurrentQuestion(askedQuestion)

        setPerformanceMetrics(prev => ({
          ...prev,
          questionsAsked: prev.questionsAsked + 1,
        }))
        
        resetTranscript()

  }






  return (
    <div className="h-screen bg-background p-4">
    <div className="grid grid-cols-5 gap-4 h-full">
      {user.role === 'INTERVIEWER' && (
        <div className="flex flex-col h-[95vh]">
          {/* Scrollable Questions Card */}
          <Card className="flex-1 overflow-hidden mb-4">
            <CardHeader className="p-4">
              <CardTitle className="text-orange-500 text-lg">Suggested Questions</CardTitle>
            </CardHeader>
            <CardContent className="p-2 h-full">
              <ScrollArea className="h-full overflow-y-auto">
                <div className="space-y-2">
                  {currentQuestion && (
                    <div>
                    <Card className=" p-2 bg-orange-100">
                      <p className="text-xs font-semibold">Current Question:</p>
                      <p className="text-sm">{currentQuestion.question}</p>
                      <div className="mt-2 space-y-2">
                        <Input
                          type="number"
                          value={currentMarks}
                          onChange={handleInputMarks}
                          placeholder="Enter marks (1-10)"
                          min={1}
                          max={10}
                          className="h-6 text-[10px] border-none placeholder:text-sm "
                          
                        />
                       
                      </div>
                    </Card>
                     <Button 
                     onClick={handleCurrentQuestionEvaluation} 
                     className="w-full h-6 text-[10px] bg-black"
                     disabled={isSubmittingMarks}
                   >
                     {isSubmittingMarks ? (
                       <>
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                         Submitting...
                       </>
                     ) : (
                       'Submit marks'
                     )}
                   </Button>
                   </div>
                  )}


{!suggestedQuestions.length && 
<div className="p-4 bg-white rounded-lg shadow-md">
      <AnimatePresence>
        {!candidateSkills.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center text-gray-500">
              AI is suggesting questions based on Candidate's Profile...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {candidateSkills.length > 0 && !suggestedQuestions.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-2">Candidate Skills:</h3>
          <AnimatedSkills skills={candidateSkills} />
        </motion.div>
      )}
    </div>
}
                  




                  {suggestedQuestions?.map((q) => (
                    <Card key={q.id} className="p-2">
                      <p className="text-xs">{q.question}</p>
                      <div className="flex justify-between items-center mt-1 text-[10px]">
                        <Badge variant="outline" className="text-[10px]">{q.relevance}</Badge>
                        <Badge variant="outline" className="text-[10px]">{q.topic}</Badge>
                        <Badge variant="outline" className="text-[10px]">{q.toughness}/5</Badge>
                      </div>
                      <Button
                        className="w-full mt-1 h-6 text-[10px] bg-black text-white hover:text-black"
                        variant="secondary"
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
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-orange-500 text-lg">Performance Metrics</CardTitle>
            </CardHeader>

            <div className='flex flex-col gap-2 absolute top-[82vh] left-[25%]'>


                   
                    <Button size="sm" variant="outline"  onClick={handleStartAsking} disabled={isRecording}>
                        <Mic className="w-4 h-4 mr-1" /> Start Asking
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleStopAsking}  disabled={!isRecording}>
                        <MicOff className="w-4 h-4 mr-1" /> End Asking
                    </Button>
                    </div>


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
              <Button 
                onClick={handleSubmitEvaluations} 
                className="w-full text-xs mt-4 bg-red-600 hover:bg-red-800 hover:text-white text-white"
                disabled={isSubmittingEvaluation}
                
              >
                {isSubmittingEvaluation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Evaluation...
                  </>
                ) : (
                  'Submit Evaluation'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Conference leaveChannel={leaveChannel} />
      <CandidateChats currentCandidateAnswer={currentCandidateAnswer} setCurrentCandidateAnswer={setCurrentCandidateAnswer} currentQuestion={currentQuestion} channel={channel} uid={uid} /> 
    </div>
  </div>
  )
}
