"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Mic, Video, Phone, MicOff, VideoOff } from "lucide-react";
import Webcam from 'react-webcam'


export default function Interview() {
  // Dynamic initial values
  const [interviewDetails, setInterviewDetails] = useState({
    interviewId: "12345",
    candidateName: "Alex Johnson",
    position: "Software Engineer",
    questionIndex: 3,
    totalQuestions: 10,
    recordingStatus: true,
    question: "Can you describe a challenging situation you faced at work and how you handled it?",
    questionTags: ["Behavioral", "Problem-Solving"],
  });

  const [metrics, setMetrics] = useState({
    score: 85,
    communication: { value: 9, status: "Improving", color: "text-green-500" },
    technicalSkills: { value: 8, status: "Stable", color: "text-yellow-500" },
  });

  const [graphData, setGraphData] = useState([4, 6, 8, 7, 6]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Function to simulate updating data from an API
  const updateMetrics = () => {
    // Example API integration logic (fetch or axios can be used here)
    setMetrics({
      score: 88,
      communication: { value: 10, status: "Improving", color: "text-green-500" },
      technicalSkills: { value: 9, status: "Improving", color: "text-green-500" },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-[#002B5B] p-4 text-white">
        <div className="space-y-1">
          <div className="text-sm">Interview ID: {interviewDetails.interviewId}</div>
          <div className="text-lg font-semibold">Candidate: {interviewDetails.candidateName}</div>
          <div className="text-sm">Position: {interviewDetails.position}</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">12:34</div>
          <Button
            variant="destructive"
            className="bg-red-500 hover:bg-red-600"
            onClick={() => alert("End Interview Logic Here")}
          >
            End Interview
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-4">
        {/* Main Video Area */}
        
        
        <Card className="col-span-1 lg:col-span-3">
          <div className="relative min-h-[400px] bg-gray-900 p-4">
          {/* <Webcam style={{ width: '100%', height: 'auto', aspectRatio: '16/9' }} /> */}

            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary">Candidate</Badge>
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setIsMicOn(!isMicOn)}
                className={!isMicOn ? "bg-red-500 text-white hover:bg-red-600" : ""}
              >
                {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={!isVideoOn ? "bg-red-500 text-white hover:bg-red-600" : ""}
              >
                {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
              <Button variant="secondary" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Metrics Sidebar */}
        <Card className="col-span-1 p-4">
          <div className="space-y-6">
            <div className="text-center">
              <div className="mb-2 h-32 w-full">
                {/* Placeholder for chart */}
                <div className="flex h-full items-end justify-center gap-2">
                  {graphData.map((height, i) => (
                    <div
                      key={i}
                      className="w-4 bg-blue-600"
                      style={{ height: `${height * 10}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="text-4xl font-bold text-[#002B5B]">{metrics.score}%</div>
              <div className="text-sm text-gray-500">Current Score</div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-[#002B5B]">Assessment Metrics</h3>
              <div className="space-y-2">
                {Object.entries(metrics).map(([key, value]) => (
                  key !== "score" && (
                    <div className="flex justify-between" key={key}>
                      <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <div>
                        <span className="font-bold text-[#002B5B]">{value.value}/10 </span>
                        <span className={`${value.color}`}>{value.status}</span>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Current Question */}
        <Card className="col-span-1 lg:col-span-3">
          <div className="p-4">
            <h2 className="mb-4 text-lg font-semibold text-[#002B5B]">Current Question</h2>
            <p className="mb-4 text-gray-700">{interviewDetails.question}</p>
            <div className="flex gap-2">
              {interviewDetails.questionTags.map((tag, index) => (
                <Badge variant="secondary" key={index}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="col-span-1 flex items-center justify-between lg:col-span-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-300" />
            <div className="h-2 w-2 rounded-full bg-gray-300" />
            <span className="text-sm text-gray-500">
              Question {interviewDetails.questionIndex} of {interviewDetails.totalQuestions}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-gray-500">
              {interviewDetails.recordingStatus ? "Recording" : "Not Recording"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
