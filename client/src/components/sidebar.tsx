import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Sidebar() {
  return (
    <div className="w-64 bg-muted p-4 h-[calc(100vh-4rem)]">
      <h2 className="font-semibold mb-4">Quick Links</h2>
      <Button asChild className="w-full mb-2 text-white bg-blue-500 hover:bg-blue-800">
        <Link href="/last-recordings">Last Interview Recordings</Link>
      </Button>
      <Button asChild variant="outline" className="w-full mb-2">
        <Link href="/resources">Learning Resources</Link>
      </Button>
      <Button asChild variant="ghost" className="w-full mb-2">
        <Link href="/settings">Account Settings</Link>
      </Button>
    </div>
  )
}

