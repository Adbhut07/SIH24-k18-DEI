'use client'

import { Navbar } from "@/components/admin/Navbar"
import { Sidebar } from "@/components/admin/Sidebar"
import { DashboardOverview } from "@/components/admin/DashboardOverview"
import { InterviewScheduler } from "@/components/admin/InterviewScheduler"
import { InterviewList } from "@/components/admin/InterviewList"
import { UserManagement } from "@/components/admin/UserManagement"

export default function Dashboard() {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 flex">
          <Sidebar />
          <main className="flex-1 p-6 space-y-6 ml-64">
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

