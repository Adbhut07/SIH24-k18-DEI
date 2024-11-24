import { Sidebar } from "@/components/candidate/sidebar"
import { Navbar } from "@/components/candidate/navbar"
import { DashboardContent } from "@/components/candidate/dashboard-content"

export default function Dashboard() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-background">
          <DashboardContent />
        </main>
      </div>
    </div>
  )
}

