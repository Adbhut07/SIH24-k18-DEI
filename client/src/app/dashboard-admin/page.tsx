'use client'

import { Navbar } from "@/components/admin/Navbar"
import { Sidebar } from "@/components/admin/Sidebar"
import { DashboardOverview } from "@/components/admin/DashboardOverview"
import { InterviewScheduler } from "@/components/admin/InterviewScheduler"
import { InterviewList } from "@/components/admin/InterviewList"
import { UserManagement } from "@/components/admin/UserManagement"
import { isAuthenticated } from "@/utils/auth"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/store/hooks"
import Cookies from "js-cookie"
import { useEffect } from "react"


export default function Dashboard() {
  const router = useRouter();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
    } else if (user.role !== 'ADMIN') {
      router.push('/no-access');
    }
  }, [user, router]); // Re-run the effect when `user` or `router` changes


 

    
    return (
    <div className="min-h-screen bg-background">
        <Navbar />
        <div className=" flex bg-gray-200 p-[25px]">
          {/* <Sidebar /> */}
          <main className="flex-1 space-y-6 ">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <DashboardOverview />
            <div className="flex gap-4">
              <InterviewScheduler />
              <InterviewList />
            </div>
            <UserManagement />
          </main>
        </div>
      </div>
    



    )
  }

