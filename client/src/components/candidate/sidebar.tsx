import { Home, Calendar, BarChart, BookOpen, Award, Bookmark } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <aside className="w-64 bg-background border-r border-border h-screen sticky top-0 overflow-y-auto">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Candidate Dashboard</h1>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            Interviews
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <BarChart className="mr-2 h-4 w-4" />
            Performance
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <BookOpen className="mr-2 h-4 w-4" />
            Resources
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Award className="mr-2 h-4 w-4" />
            Achievements
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Bookmark className="mr-2 h-4 w-4" />
            Bookmarks
          </Button>
        </nav>
      </div>
      <div className="p-4 border-t border-border">
        <h2 className="font-semibold mb-2">Interview Insights</h2>
        <p className="text-sm text-muted-foreground">Total Interviews: 12</p>
        <p className="text-sm text-muted-foreground">Avg. Performance: 8.5/10</p>
      </div>
    </aside>
  )
}

