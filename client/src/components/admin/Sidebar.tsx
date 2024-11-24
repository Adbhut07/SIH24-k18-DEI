import { Calendar, Users, BarChart2, FileText, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 h-[calc(100vh-4rem)] p-4 space-y-4 fixed top-16 left-0 overflow-y-auto">
      <Button variant="ghost" className="w-full justify-start">
        <Calendar className="mr-2 h-4 w-4" />
        Interviews
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <Users className="mr-2 h-4 w-4" />
        Candidates
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <BarChart2 className="mr-2 h-4 w-4" />
        Analytics
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <FileText className="mr-2 h-4 w-4" />
        Reports
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Button>
    </div>
  )
}

