'use client';
import { Navbar } from "@/components/interviewer/navbar"
import { UpcomingInterviews } from "@/components/interviewer/upcoming-interviews"
import { RecentInterviews } from "@/components/interviewer/recent-interviews"
import { InterviewerProfile } from "@/components/interviewer/interviewer-profile"
import { InterviewHistory } from "@/components/interviewer/interview-history"
import { PerformanceCard } from "@/components/interviewer/performance-card"
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";
import { useAppSelector } from "@/lib/store/hooks";
import { useEffect } from "react";
import UpcomingInterviewsCard from "@/components/interviewer/upcoming-interviews-card";
import { TaskManagementSection } from "@/components/interviewer/task-management-section";
import { CollaborationFeatures } from "@/components/interviewer/collaboration-features";
import { PastInterviewsCard } from "@/components/interviewer/past-interviews-card";
import { FeedbackAndNotesSection } from "@/components/interviewer/feedback-and-notes-section";
import ProfileCard from "@/components/interviewer/profile-card";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
    } else if (user.role == 'CANDIDATE') {
      router.push('/no-access');
    }
  }, [user, router]); // Re-run the effect when `user` or `router` changes

  // You can render a loading spinner or a placeholder here while checking authentication and role.

  


  return (
    <div className="min-h-screen bg-background bg-gray-200">
      <Navbar />
      <main className="container mx-auto p-8 space-y-6">


        <div className="flex w-full gap-4 p-4 h-auto ">

          <ProfileCard
            name={user.name}
            skills={["JavaScript", "React", "Node.js"]}
            totalInterviews={150}
            profilePicture="/placeholder.svg?height=100&width=100"
            status="Available"
            rating={4.8}
            department="Engineering"
          />

          <UpcomingInterviewsCard />

        </div>
        <PastInterviewsCard />

        <div className="grid gap-6 md:grid-cols-2 ">
          <TaskManagementSection />
          <CollaborationFeatures />
        </div>
        <FeedbackAndNotesSection />
      </main>
    </div>
  )



}

