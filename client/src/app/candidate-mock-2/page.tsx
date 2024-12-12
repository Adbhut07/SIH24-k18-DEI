'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Video, VideoOff, Send, Volume2 } from 'lucide-react'
<<<<<<< Updated upstream
=======
import useWebSocket from '@/hooks/useWebSocket'
import { useAppSelector } from '@/lib/store/hooks'
import { useParams } from 'next/navigation'
>>>>>>> Stashed changes
import OpenAI from 'openai'

interface CandidateInfo {
  name: string;
  position: string;
}

interface Question {
    id: number;
    text: string;
    keywords: string[];
    topic?: string;
    relevance?: string;
    toughness?: number;
    difficulty?: string;
    category?: string;
  }

  interface Answer {
    questionId: number;
    text: string;
    relevancyScore: number;
    marks: number;
    feedback: string;
  }

const mockQuestions: Question[] = [
  { id: 1, text: "Can you describe your experience with React?", keywords: ["components", "state", "props", "hooks", "virtual DOM"] },
  { id: 2, text: "How do you manage state in large applications?", keywords: ["Redux", "Context API", "MobX", "Recoil", "state management"] },
  { id: 3, text: "Explain the concept of server-side rendering.", keywords: ["SSR", "Next.js", "initial load", "SEO", "performance"] },
  { id: 4, text: "What are your strategies for optimizing React performance?", keywords: ["memoization", "useMemo", "useCallback", "React.memo", "code splitting"] },
  { id: 5, text: "How do you approach testing in React applications?", keywords: ["Jest", "React Testing Library", "unit tests", "integration tests", "end-to-end tests"] },
]

export default function CandidateInterviewUI() {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<Question[]>([]);
  const [isUsingMockQuestions, setIsUsingMockQuestions] = useState(true);


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
  

  const candidateInfo: CandidateInfo = {
    name: "John Doe",
    position: "Senior React Developer"
  }

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          mediaRecorderRef.current = new MediaRecorder(stream);
        })
        .catch(err => {
          console.error("Error accessing media devices:", err);
          setMediaError("Unable to access camera and microphone. Please ensure you have granted the necessary permissions.");
        });
    }
  }, []);

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTrack = (videoRef.current.srcObject as MediaStream)
        .getVideoTracks()[0];
      videoTrack.enabled = !isVideoOn;
    }
  }

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTrack = (videoRef.current.srcObject as MediaStream)
        .getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
      }
    }
  }

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

async function getSuggestedQuestions(topics: string[], loadMore = false) {
    // Join topics into a comma-separated string
    const topicsList = topics.join(', ');

    // Modify the number of questions based on loadMore
    const questionCount = loadMore ? 25 : 25;

    // Construct the prompt dynamically
    const prompt = `Generate ${questionCount} interview questions related to the topics: ${topicsList}. Ensure the questions are ordered by toughness, starting from the easiest to the hardest. Format the response as a JSON array where each element is an object with the following structure:
{
  "id": [unique integer starting from 1],
  "text": [string containing the interview question],
  "topic": [string indicating the specific topic],
  "keywords": [array of relevant keywords],
  "relevance": ["high", "medium", or "low"],
  "toughness": [integer between 1 and 5, where 1 is the easiest and 5 is the hardest],
  "difficulty": ["easy", "intermediate", or "hard"],
  "category": [string representing a subfield of the topic]
}

The questions must align closely with the given topics.`;

    try {
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

        if (!responseContent) {
            throw new Error("No content received from the AI model.");
        }

        console.log("AI Response:", responseContent);

        // Extract JSON array from the response
        const firstIndex = String(responseContent).indexOf('[');
        const secondIndex = String(responseContent).lastIndexOf(']');
        responseContent = responseContent.slice(firstIndex, secondIndex + 1);

        try {
            const parsedQuestions = JSON.parse(responseContent);

            console.log("Parsed Questions:", parsedQuestions);
    
            if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
              if (loadMore) {
                setSuggestedQuestions(prevQuestions => [...prevQuestions, ...parsedQuestions]);
              } else {
                setSuggestedQuestions(parsedQuestions);
                setIsUsingMockQuestions(false);
              }
            } else {
              console.warn("Parsed content is not in the expected array format or is empty.");
            }
          } catch (jsonError) {
            console.error("Error parsing JSON response:", jsonError);
          }
    } catch (error) {
        console.error("Error in getSuggestedQuestions:", error);
      }
}

const handleFetchQuestions = async () => {
    const topics = ["Data Structures", "Algorithms", "React", "System Design"];
    await getSuggestedQuestions(topics); // Fetches questions based on the provided topics
};

useEffect(() => {
    handleFetchQuestions();
    console.log(suggestedQuestions);
}, []);

const handleLoadMoreQuestions = async () => {
    const topics = ["React", "Performance Optimization", "Testing"];
    await getSuggestedQuestions(topics, true); // Fetches more questions and appends to the list
  };


  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % mockQuestions.length);
    setAnswer('');
  }

  const calculateRelevancyScore = (answer: string, keywords: string[]): number => {
    const lowerAnswer = answer.toLowerCase();
    const matchedKeywords = keywords.filter(keyword => lowerAnswer.includes(keyword.toLowerCase()));
    return Number(((matchedKeywords.length / keywords.length) * 10).toFixed(1));
  }

 

  const handleSubmitAnswer = () => {
    const currentQuestion = mockQuestions[currentQuestionIndex];
    const relevancyScore = calculateRelevancyScore(answer, currentQuestion.keywords);
    const marks = Math.min(Math.round(relevancyScore + Math.random() * 2), 10);
    const feedback = generateFeedback(relevancyScore, marks, currentQuestion.id);

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      text: answer,
      relevancyScore,
      marks,
      feedback
    };

    setAnswers([...answers, newAnswer]);
    handleNextQuestion();
  }

  const toggleRecording = () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.start();
        setIsRecording(true);

        mediaRecorderRef.current.ondataavailable = (event) => {
          // Here you would typically send this blob to a speech-to-text service
          console.log("Recorded audio blob:", event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          console.log("Recording stopped");
        };
      }
    }
  }

<<<<<<< Updated upstream
//   console.log(suggestedQuestions);
=======

  
  
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
    "relevance": ["high", "medium", or "low"] How the question relates to the candidate's skills,
    "toughness": [integer between 1 and 5],
    "difficulty": ["easy", "intermediate", or "hard"],
    "category": [string representing a subfield],
    "ai_ans": [detailed AI-generated answer (3-5 sentences), with properly escaped characters]
  }
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




  useEffect(()=>{
    if (candidateSkills.length>0){
      getSuggestedQuestions()
    }
  },[candidateSkills])
>>>>>>> Stashed changes

  return (
    <div className="container mx-auto p-6 flex gap-6 min-h-screen bg-gray-50">
      <Card className="w-1/4 mr-4 shadow-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Interview Questions</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Question {currentQuestionIndex + 1}:</h3>
            <p className="text-gray-700 mb-4">{mockQuestions[currentQuestionIndex].text}</p>
            <Textarea
              placeholder="Type your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full mb-4"
              rows={6}
            />
            <div className="flex flex-col space-y-2 items-center">
              <Button onClick={toggleRecording} variant={isRecording ? "destructive" : "default"} size="sm" disabled={!!mediaError}>
                {isRecording ? <Volume2 className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                {isRecording ? "Stop" : "Start Answering"}
              </Button>
              <Button onClick={handleSubmitAnswer} size="sm">
                Submit
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-2/4 mx-4 shadow-md flex flex-col">
        <CardContent className="p-6 flex-grow flex flex-col">
          <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 flex-grow">
            {mediaError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xl p-4 text-center">
                {mediaError}
              </div>
            ) : isVideoOn ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xl">
                Camera Off
              </div>
            )}
          </div>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <Button
              variant={isAudioOn ? "outline" : "destructive"}
              size="icon"
              onClick={toggleAudio}
              disabled={!!mediaError}
            >
              {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              <span className="sr-only">{isAudioOn ? 'Mute' : 'Unmute'}</span>
            </Button>
            <Button
              variant={isVideoOn ? "outline" : "destructive"}
              size="icon"
              onClick={toggleVideo}
              disabled={!!mediaError}
            >
              {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              <span className="sr-only">{isVideoOn ? 'Turn off camera' : 'Turn on camera'}</span>
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">{candidateInfo.name}</h2>
            <p className="text-gray-600">{candidateInfo.position}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="w-1/4 ml-4 shadow-md">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4">Answer Evaluation</h2>
          {answers.map((answer, index) => (
            <div key={answer.questionId} className="mb-6 pb-4 border-b border-gray-200 last:border-b-0">
              <h3 className="text-lg font-semibold mb-2">Question {index + 1}</h3>
              <div className="mb-2">
                <span className="font-medium">Relevancy Score: {answer.relevancyScore.toFixed(1)}/10</span>
                <Progress value={answer.relevancyScore * 10} className="mt-2" />
              </div>
              <div className="mb-2">
                <span className="font-medium">Marks:</span> {answer.marks}/10
              </div>
              <p className="text-sm text-gray-600 mt-2">{answer.feedback}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
