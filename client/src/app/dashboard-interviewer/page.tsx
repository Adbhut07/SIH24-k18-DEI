'use client';
import { Navbar } from "@/components/interviewer/navbar"
import { UpcomingInterviews } from "@/components/interviewer/upcoming-interviews"
import { RecentInterviews } from "@/components/interviewer/recent-interviews"
import { InterviewerProfile } from "@/components/interviewer/interviewer-profile"
import { InterviewHistory } from "@/components/interviewer/interview-history"
import { PerformanceCard } from "@/components/interviewer/performance-card"

export default function DashboardPage() {

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Interviewer Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <UpcomingInterviews />
          <RecentInterviews />
          <InterviewerProfile />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <InterviewHistory />
          <PerformanceCard />
        </div>
      </main>
    </div>
  )
}

