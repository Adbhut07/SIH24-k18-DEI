'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useParams } from "next/navigation";
import axios from "axios";
import { MessageCircle, Mic, MicOff, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import 'regenerator-runtime/runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import CandidateSelector from "./components/CandidateSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { JobCard } from "./components/card";




interface WebSocketMessage {
  question: string;
  topics: string;
}

interface WebSocketResponse {
  relevance?: string;
  ideal_answer?: string;
  topic?: string;
  category?: string;
  feedback?: string;
  toughness?: string;
  suggestion?: string;
}

interface ChatMessage {
  type: 'user' | 'system';
  content: string | WebSocketResponse;
}

export default function InterviewEvaluationChat() {
  const [question, setQuestion] = useState<string>("");
  const [topics, setTopics] = useState<string>("");
  const [role, setRole] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [mockInterview,setMockInterview] = useState(null)
  const [askedQuestions,setAskedQuestions] = useState([])
  const [isRecording, setIsRecording] = useState(false);

  const [mockInterviews, setMockInterviews] = useState(null)
  const [selectedValue, setSelectedValue] = useState("")


   const {
          transcript,
          resetTranscript,
          listening,
          browserSupportsSpeechRecognition,
      } = useSpeechRecognition()



  const {interviewId} = useParams()
  console.log(interviewId)


  const dummyInterviewId = '8533a7e3-005f-4332-861e-56874ed167f7'

  const websocketRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }


    const ws = new WebSocket("ws://localhost:8000/ws-evaluate");

    ws.onopen = () => {
      setIsConnected(true);
      setConnectionError(null);
      setChatHistory(prev => [...prev, { type: 'system', content: 'Connected to WebSocket' }]);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = event.data;
        console.log(data)
        const cleaned = String(data).replace('/\g', '').substring(1, data.length - 1).split("|")
        const cleanedObj: WebSocketResponse = {
          relevance: cleaned[0] || "",
          ideal_answer: cleaned[1] || "",
          topic: cleaned[2] || "",
          category: cleaned[3] || "",
          feedback: cleaned[4] || "",
          toughness: cleaned[5] || "",
          suggestion: cleaned[6] || "",
        };

        console.log("Received WebSocket message:", cleanedObj);
        setChatHistory(prev => [...prev, { type: 'system', content: cleanedObj }]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        setChatHistory(prev => [...prev, { type: 'system', content: { error: "Failed to parse server response" } }]);
      }
    };

    ws.onclose = (event: CloseEvent) => {
      setIsConnected(false);
      if (!event.wasClean) {
        setConnectionError(`Connection lost: ${event.reason || 'Unknown reason'}`);
        setChatHistory(prev => [...prev, { type: 'system', content: `Connection lost: ${event.reason || 'Unknown reason'}` }]);
      }
    };

    ws.onerror = (error: Event) => {
      console.error("WebSocket error", error);
      setConnectionError("WebSocket connection failed");
      setIsConnected(false);
      setChatHistory(prev => [...prev, { type: 'system', content: "WebSocket connection failed" }]);
    };

    websocketRef.current = ws;
  }, []);

  const sendMessage = useCallback(() => {
    const ws = websocketRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setConnectionError("WebSocket is not connected");
      return;
    }

    if (!question.trim() || !topics.trim()) {
      setConnectionError("Please fill in all fields");
      return;
    }

    const payload: WebSocketMessage = {
      question: question,
      topics: topics,
    };

    setAskedQuestions(prev => [...prev, question])

    try {
      ws.send(JSON.stringify(payload));
      setChatHistory(prev => [...prev, { type: 'user', content: `Question: ${question} \n ` }]);
      setQuestion("");
      setConnectionError(null);
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
      setConnectionError("Failed to send message");
    }
  }, [question, topics]);

  useEffect(() => {

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);


  const handleFetchInterviewDetails = async ()=>{

    try{
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/mockInterview/get/${selectedValue}`,{withCredentials:true})
      console.log(response?.data?.data)

      setMockInterview(response?.data?.data?.mockInterview)
      setTopics(response?.data?.data?.mockInterview?.topics.join(','))

    } 
    catch(error){
      console.log(error)
    }

  }

  useEffect(() => {
    const fetchAllInterviewsTitles = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/mockInterview/getAllTitles`, {
          withCredentials: true
        });
        
        const mockInterviews_data = response?.data?.data?.mockInterviews;
        setMockInterviews(mockInterviews_data)
        console.log(mockInterviews)

      } catch (error) {
        console.error('Error fetching mock interviews:', error);
      }
    };

    fetchAllInterviewsTitles();
  }, []);





 



  const handleStartRecording= ()=>{
    setIsRecording(true)
        resetTranscript()
        SpeechRecognition.startListening({ continuous: true })
  }

  const handleStopRecording  = ()=>{
    setIsRecording(false)
        SpeechRecognition.stopListening()

        setQuestion(transcript)

        resetTranscript()

  }



  const handleChange = (value: string) => {
    setSelectedValue(value)
    console.log("Selected value:", value)
  }

  useEffect(()=>{
    if (selectedValue){
      handleFetchInterviewDetails()
    }
    

  },[selectedValue])



  return (
    <div className="flex h-screen bg-gray-50 p-4">
     

     <div className="w-[30%] flex flex-col gap-6">
      <Select onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a role
          " />
        </SelectTrigger>
        <SelectContent>

            {mockInterviews?.map((mockInterview) => (
                <SelectItem key={mockInterview.id} value={mockInterview.id}>
                {mockInterview.title}
                </SelectItem>
            ))}
          
        </SelectContent>
      </Select>



      <JobCard
        title={mockInterview?.title}
        description={mockInterview?.description}
        jobId={mockInterview?.jobId}
      />
      
    </div>


      <Card className="flex-grow flex flex-col max-w-3xl w-full mx-auto shadow-lg">
        <CardContent className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold">Interviewer Evaluation Chat</h1>
            <Button 
              onClick={connectWebSocket} 
              disabled={isConnected} 
              variant={isConnected ? "secondary" : "default"}
              size="sm"
              className="text-xs"
            >
              {isConnected ? "Connected" : "Connect With Board Room"}
            </Button>
          </div>

          {connectionError && <p className="text-red-500 text-xs mb-2">{connectionError}</p>}

          {mockInterview && (
            <div className="mb-4 text-xs flex items-center justify-between bg-gray-100 p-2 rounded-md">
              <p className="font-medium">Required Experience: {mockInterview?.requiredExperience} years</p>
              <div className="flex flex-wrap gap-1">
                {mockInterview?.topics?.map((topic, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">{topic}</Badge>
                ))}
              </div>
            </div>
          )}

          <ScrollArea className="flex-grow mb-4 overflow-y-auto">
            <div className="space-y-2">
              {chatHistory.map((message, index) => (
                <Card key={index} className={`${message.type === 'user' ? 'ml-auto bg-blue-50' : 'mr-auto bg-white'} max-w-[80%]`}>
                  <CardContent className="p-2 text-xs">
                    {typeof message.content === 'string' ? (
                      <p>{message.content}</p>
                    ) : (
                      <div className="space-y-1">
                        {Object.entries(message.content).map(([key, value]) => (
                          <p key={key}><strong>{key}:</strong> {value}</p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter interview question"
              className="flex-grow text-xs"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={!isConnected} size="sm" className="px-2 py-1">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='flex flex-col gap-2 absolute  left-[400px] top-[85vh]'>
        <Button size="sm" variant="outline" className="text-xs" onClick={handleStartRecording} disabled={isRecording}>
          <Mic className="w-3 h-3 mr-1" /> Start Asking
        </Button>
        <Button size="sm" variant="destructive" className="text-xs" onClick = {handleStopRecording} disabled={!isRecording}>
          <MicOff className="w-3 h-3 mr-1" /> End Asking
        </Button>
      </div>

      <Button size="sm" variant="secondary" className="absolute top-4 right-4 text-xs">
        <MessageCircle className="w-3 h-3 mr-1" /> View Stats
      </Button>

    </div>


  );
}