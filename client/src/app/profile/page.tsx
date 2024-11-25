'use client'
import { Sidebar } from "@/components/profile/sidebar"
import { Navbar } from "@/components/profile/navbar"
import { MainContent } from "@/components/profile/mainContent"

export default function Dashboard() {

  
  return (
    <div className="flex h-screen ">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-background">
          <MainContent/>
        </main>
      </div>
    </div>
  )
}