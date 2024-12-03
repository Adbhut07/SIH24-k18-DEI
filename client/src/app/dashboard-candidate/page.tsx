'use client'

import { Sidebar } from "@/components/candidate/sidebar"
import { Navbar } from "@/components/candidate/navbar"
import DashboardContent from "@/components/candidate/dashboard-content";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { isAuthenticated } from "@/utils/auth";

export default function Dashboard() {

  const router = useRouter();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/signin');
    } else if (user.role != 'CANDIDATE') {
      router.push('/no-access');
    }
  }, [user, router]); // Re-run the effect when `user` or `router` changes


  
  return (
    <div className="flex h-screen ">
      
      <div className="flex flex-col flex-1 overflow-hidden ">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-gray-200 p-4">
          <DashboardContent />
        </main>
      </div>
    </div>
  )
}

