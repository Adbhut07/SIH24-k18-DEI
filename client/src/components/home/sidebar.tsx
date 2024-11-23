import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function Sidebar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-lg">Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          <li>
            <Link href="#" className="text-primary hover:underline">Schedule Interview</Link>
          </li>
          <li>
            <Link href="#" className="text-primary hover:underline">Join Virtual Boardroom</Link>
          </li>
          <li>
            <Link href="#" className="text-primary hover:underline">AI Assistant</Link>
          </li>
          <li>
            <Link href="#" className="text-primary hover:underline">Help & Support</Link>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

