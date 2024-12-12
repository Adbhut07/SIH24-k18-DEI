'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Video, VideoOff, Send, Volume2 } from 'lucide-react'

interface CandidateInfo {
  name: string;
  position: string;
}

interface Question {
  id: number;
  text: string;
  keywords: string[];
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

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % mockQuestions.length);
    setAnswer('');
  }

  const calculateRelevancyScore = (answer: string, keywords: string[]): number => {
    const lowerAnswer = answer.toLowerCase();
    const matchedKeywords = keywords.filter(keyword => lowerAnswer.includes(keyword.toLowerCase()));
    return Number(((matchedKeywords.length / keywords.length) * 10).toFixed(1));
  }

  const generateFeedback = (relevancyScore: number, marks: number, questionId: number): string => {
    const feedbacks = [
      "Your answer demonstrates a good understanding of React concepts. Try to elaborate more on specific examples from your experience.",
      "You've touched on some key points of state management. Consider discussing the trade-offs between different approaches.",
      "Your explanation of server-side rendering is clear. It would be beneficial to mention specific use cases where SSR is advantageous.",
      "You've listed some great optimization techniques. Try to explain how each technique specifically improves performance.",
      "Your testing approach seems comprehensive. Consider discussing how you prioritize different types of tests in your workflow."
    ];

    let feedback = feedbacks[questionId - 1];

    if (relevancyScore < 5) {
      feedback += " Make sure to address all parts of the question in your response.";
    } else if (marks < 7) {
      feedback += " Your answer is on the right track, but try to provide more depth in your explanations.";
    } else {
      feedback += " Excellent job on this question!";
    }

    return feedback;
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
            <div className="flex justify-between items-center">
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
