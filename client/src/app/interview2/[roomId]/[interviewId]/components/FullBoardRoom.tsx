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

export default function FullBoardRoom({channel,uid,leaveChannel}) {

  const user = useAppSelector((state)=>state.user)

  const {roomId,interviewId} = useParams();


  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [totalMarks, setTotalMarks] = useState(0)
  const [isAsking,setIsAsking] = useState(false);
  const [currentMarks, setCurrentMarks] = useState('')
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

  const [isSubmittingMarks, setIsSubmittingMarks] = useState(false)
  const [isSubmittingEvaluation, setIsSubmittingEvaluation] = useState(false)



  const [answeredQuestions, setAnsweredQuestions] = useState([])



  // Candidate skills (replace with actual skills)
  const candidateSkills = "JavaScript, React, Node.js, SQL, Data Structures";


  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.API_KEY || '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',
    dangerouslyAllowBrowser: true
  })

  const prompt = `Generate 10 interview questions related to these skills: ${candidateSkills}.

Return the result as a **valid JSON array** where each element is a JSON object. Ensure the JSON is properly formatted with no syntax errors. Each object should have the following fields:

-- **"id**: A unique identifier for the question.
- **"question"**: A string representing the interview question.
- **"topic"**: A string indicating the specific topic related to the skills.
- **"relevance"**: A string indicating the relevance of the question to the skills (must be one of: "high", "medium", "low").
- **"toughness"**: An integer between 1 and 5 indicating the toughness of the question.
- **"difficulty"**: A string indicating the difficulty level (must be one of: "easy", "intermediate", "hard").
- **"category"**: A string representing a general category or subfield related to the question.
- **"ai_answer"**: A string containing a detailed AI-generated answer (approximately 3-5 sentences).

DO NOT ADD ANY OTHER COMMENTS OR TEXT IN THE RESPONSE, I JUST WANT THE JSON ARRAY. 

**Example Output:**
[
  {
    "question": "What is the time complexity of a binary search algorithm?",
    "id": 1,
    "topic": "Algorithms",
    "relevance": "high",
    "toughness": 3,
    "difficulty": "intermediate",
    "category": "Computer Science",
    "ai_answer": "The time complexity of a binary search algorithm is O(log n). Binary search works by repeatedly dividing the search interval in half, which allows it to quickly narrow down the target value. This efficiency makes it ideal for searching in sorted datasets."
  },
  {
    "question": "How does a convolutional neural network (CNN) process image data?",
    "id": 2,
    "topic": "Machine Learning",
    "relevance": "high",
    "toughness": 4,
    "difficulty": "hard",
    "category": "Deep Learning",
    "ai_answer": "A CNN processes image data by applying convolutional filters to extract features such as edges and textures. These features are then passed through multiple layers of convolution, pooling, and fully connected layers. This structure helps the network learn hierarchical patterns in the image, which is crucial for tasks like object detection and image classification."
  }
]
`

  async function getSuggestedQuestions() {
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
  
      const parsedQuestions = JSON.parse(responseContent+']');
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
    getSuggestedQuestions();
   
  
  },[])

}












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
   

    const currentEvaluation = {
      question: currentQuestion?.question,
      ideal_ans: currentQuestion?.ai_answer,
      toughness: currentQuestion?.toughness,
      relevancy: currentQuestion?.relevance,
      category: currentQuestion?.category,
      topic: currentQuestion?.topic,
      feedback_ai: "Feedback is worst",
      marks_given_by_interviewers: [
        {
          interviewerId: user.id,
          score: Number(currentMarks),
        },
      ],
    }

    setAnsweredQuestions((prev)=>[...prev,currentEvaluation])
    setCurrentMarks(0);
    setCurrentQuestion(null)

    setIsSubmittingMarks(false)
  }

  const handleSubmitEvaluations = async () => { 
    setIsSubmittingEvaluation(true)
    const data = {
      interviewId: interviewId,
      questionDetails: [
        ...answeredQuestions
      ],
    };
    try{
  
      const response = await axios.post(`http://localhost:5454/api/v1/evaluation`,data,{withCredentials:true})
      console.log("evaluated" ,response)
  
    }
    catch(error){
      console.log(error)
      toast.error('Failed to submit evaluation!')
    }
    finally{
      setIsSubmittingEvaluation(false)
      toast.success('Evaluation submitted successfully!')
    }


  }

  const handleInputMarks = (e) => {

    const value = e.target.value;
    if (value<=10 || value==""){
      setCurrentMarks(value)
    }
  

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
      <CandidateChats currentQuestion={currentQuestion} channel={channel} uid={uid} /> 
    </div>
  </div>
  )
}
