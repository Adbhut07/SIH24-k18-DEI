import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl mr-6">Skill Matrix</Link>
        <div className="flex space-x-10 ml-20">
          <Link href="/">Home</Link>
          <Link href="/schedule-interview">Schedule Interview</Link>
          <Link href="/dashboard" className="text-blue-500">Dashboard</Link>
          <Link href="/about">About Us</Link>
        </div>
        <div className="ml-">
          <Button variant="ghost">Profile</Button>
        </div>
      </div>
    </nav>
  )
}

