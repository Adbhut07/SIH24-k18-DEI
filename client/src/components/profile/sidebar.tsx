import { User, Edit, FileText, Award, LogOut, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen sticky top-0 overflow-y-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <nav className="space-y-2 border-t border-gray-700 pt-2">
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-gray-700" asChild>
            <a href="#profile-summary">
              <User className="mr-2 h-4 w-4" />
              Profile & Summary
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-gray-700" asChild>
            <a href="#edit-profile">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-gray-700" asChild>
            <a href="#medical-report">
              <FileText className="mr-2 h-4 w-4" />
              Medical Report
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-gray-700" asChild>
            <a href="#skills-achievements">
              <Award className="mr-2 h-4 w-4" />
              Skills & Achievements
            </a>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-gray-700">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </div>
      <div className="p-4 border-t border-gray-700 text-white">
        <Button variant="ghost" className="w-full justify-between text-white hover:text-white hover:bg-gray-700" asChild>
          <a href="#profile-summary">
            Back to Top
            <ChevronUp className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </aside>
  )
}

