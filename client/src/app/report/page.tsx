'use client'
import InterviewReport from '@/components/report/InterviewReport';
import react from 'react';


export default function Report() {
    // Sample data - replace with actual data in a real application
    const sampleData = {
      candidateName: "John Doe",
      interviewerName: "Jane Smith",
      jobDescription: "Senior Full Stack Developer with expertise in React and Node.js",
      candidateSkills: ["React", "Node.js", "TypeScript", "GraphQL", "AWS"],
      totalQuestions: 15,
      questionCategories: ["Technical Skills", "Problem Solving", "System Design", "Soft Skills"],
      performanceData: [
        { topic: "React", score: 8 },
        { topic: "Node.js", score: 7 },
        { topic: "TypeScript", score: 6 },
        { topic: "GraphQL", score: 5 },
        { topic: "System Design", score: 7 },
        { topic: "Problem Solving", score: 8 },
        { topic: "Communication", score: 9 },
      ],
    }
  
    return (
      <main className="min-h-screen bg-background py-12 px-4">
        <InterviewReport {...sampleData} />
       

      </main>
    )
  }