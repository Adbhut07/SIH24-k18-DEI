// pages/assessment.tsx
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Progress } from "src/components/ui/progress";
import { Separator } from "src/components/ui/separator";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Image from "next/image";

// Mock data for the candidate
const candidateData = {
  name: "John Doe",
  applicationId: "123456",
  position: "Software Engineer",
  assessmentDate: "2023-11-26",
  finalScore: 85,
  interviewerScore: 51,
  aiScore: 34,
  outcome: "PASS",
};

const barData = [
  { name: "Technical", value: 87 },
  { name: "Behavioral", value: 80 },
  { name: "Domain", value: 88 },
  { name: "Body Language", value: 82 },
  { name: "Cheating Detection", value: 95 },
];

const breakdownData = [
  { metric: "Technical Knowledge", score: 87, required: 80, result: "PASS" },
  { metric: "Behavioral & Communication", score: 80, required: 75, result: "PASS" },
  { metric: "Domain Expertise", score: 88, required: 80, result: "PASS" },
  { metric: "Body Language & Posture", score: 82, required: 75, result: "PASS" },
  { metric: "Cheating Detection", score: 95, required: 90, result: "PASS" },
  { metric: "Aggregate Score", score: 85, required: 80, result: "PASS" },
];

export default function CandidateAssessmentReport() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">DRDO Recruitment</h1>
            <p className="text-gray-600">Candidate Assessment Report</p>
          </div>
          <Image src="/drdo-logo.png" alt="DRDO Logo" width={100} height={100} />
        </div>
        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Candidate Proficiency Assessment</CardTitle>
            <CardDescription>Empowered by DRDO's Intelligent Recruitment Framework</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Name:</strong> {candidateData.name}</p>
                <p><strong>Application ID:</strong> {candidateData.applicationId}</p>
              </div>
              <div>
                <p><strong>Position Applied For:</strong> {candidateData.position}</p>
                <p><strong>Assessment Date:</strong> {candidateData.assessmentDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Comprehensive Evaluation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold">Final Score: {candidateData.finalScore}%</p>
                <Progress value={candidateData.finalScore} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>Interviewer Evaluation (60%): {candidateData.interviewerScore}%</p>
                  <Progress value={candidateData.interviewerScore} />
                </div>
                <div>
                  <p>AI Evaluation (40%): {candidateData.aiScore}%</p>
                  <Progress value={candidateData.aiScore} />
                </div>
              </div>
              <p className="text-lg font-semibold">Assessment Outcome: <span className="text-green-600">{candidateData.outcome}</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Individual Scores Across Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-lg">
          <CardHeader>
            <CardTitle>Final Assessment Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {breakdownData.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-4">
                  <span>{item.metric}</span>
                  <span>{item.score}%</span>
                  <span>{item.required}%</span>
                  <span className={item.result === "PASS" ? "text-green-600" : "text-red-600"}>{item.result}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
