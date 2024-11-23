import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { QuickActions } from "@/components/quick-actions"
import { RecentInterviews } from "@/components/recent-interviews"
import { UpcomingInterviews } from "@/components/upcoming-interviews"
import { SkillsShowcase } from "@/components/skills-showcase"
import { ProgressCard } from "@/components/progess-card"
import { InterviewTips } from "@/components/interview-tips"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="space-y-6">
            {/* First row: Flex container */}
            <div className="flex gap-6">
              <RecentInterviews className="flex-1" />
              <QuickActions className="flex-1" />
              <UpcomingInterviews className="flex-1" />
            </div>
            {/* Second row */}
            <div className="grid gap-6 md:grid-cols-1">
              <SkillsShowcase />
            </div>
            {/* Third row */}
            <div className="grid gap-6 md:grid-cols-2">
              <ProgressCard />
              <InterviewTips />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

