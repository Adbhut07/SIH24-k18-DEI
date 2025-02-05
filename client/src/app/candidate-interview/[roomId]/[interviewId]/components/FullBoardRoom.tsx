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
import InterviewFocusGuard from "@/components/tab-switching/InterviewFocusGuard"

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

    const prompt = `
Generate 15 interview questions related to these skills: ${skills}. 
Return the result as a **valid JSON array** where each element is a JSON object. 
Also ensure the proper formatting, proper terminated strings as keys, and that all strings are correctly escaped. 
Ensure the JSON is properly formatted with no syntax errors. 
Each object should have the following fields:
- **"id"**: A unique identifier for the question.
- **"question"**: A string representing the interview question.
- **"topic"**: A string indicating the specific topic related to the skills.
- **"relevance"**: A string indicating the relevance of the question to the skills (must be one of: "high", "medium", "low").
- **"toughness"**: An integer between 1 and 5 indicating the toughness of the question.
- **"difficulty"**: A string indicating the difficulty level (must be one of: "easy", "intermediate", "hard").
- **"category"**: A string representing a general category or subfield related to the question.
- **"ai_answer"**: A string containing a detailed AI-generated answer (approximately 3-5 sentences). 

DO NOT ADD ANY OTHER COMMENTS OR TEXT IN THE RESPONSE, I JUST WANT THE JSON ARRAY. 
Ensure that all strings, especially within the **"ai_answer"** field, do not contain unescaped characters (like quotes or newlines) that may break the JSON formatting.

**Example Output:**
[
    {
        "id": 1,
        "question": "What is the time complexity of a binary search algorithm?",
        "topic": "Algorithms",
        "relevance": "high",
        "toughness": 3,
        "difficulty": "intermediate",
        "category": "Computer Science",
        "ai_answer": "The time complexity of a binary search algorithm is O(log n). Binary search works by repeatedly dividing the search interval in half, which allows it to quickly narrow down the target value. This efficiency makes it ideal for searching in sorted datasets."
    },
    {
        "id": 2,
        "question": "How does a convolutional neural network (CNN) process image data?",
        "topic": "Machine Learning",
        "relevance": "high",
        "toughness": 4,
        "difficulty": "hard",
        "category": "Deep Learning",
        "ai_answer": "A CNN processes image data by applying convolutional filters to extract features such as edges and textures. These features are then passed through multiple layers of convolution, pooling, and fully connected layers. This structure helps the network learn hierarchical patterns in the image, which is crucial for tasks like object detection and image classification."
    }
]
`



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
  
      const responseContent = completion?.choices?.[0]?.message?.content;
      if (!responseContent) {
        throw new Error("No content received from the AI model.");
      }
  
       console.log(responseContent)
  
      const parsedQuestions = JSON.parse(responseContent);
      console.log(parsedQuestions)
  
      // Update state with the parsed questions
      setSuggestedQuestions(parsedQuestions);
  
      
  
      if (parsedQuestions.length === 0) {
        console.warn("No valid questions could be parsed from the response.");
      } else {
        console.log("Parsed Questions:", parsedQuestions);
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
  if (candidateSkills.length>0 && user.role == 'INTERVIEWER'){
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

    const currentEvaluation = {...response,question:currentQuestion?.question,candidate_ans:currentCandidateAnswer || "not answered",marks_given_by_interviewers: [
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

        const askedQuestion = {
          
            id: uuid(),
            question: transcript,
            ai_answer: "not fetched",
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
    <>
    {/* <InterviewFocusGuard /> */}
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
  </>
  )
}
