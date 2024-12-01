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
    
}

    </div>
  )
}

