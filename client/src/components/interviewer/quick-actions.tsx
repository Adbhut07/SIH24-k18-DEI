import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button asChild className="w-full">
          <Link href="/join-interview">Join Interview</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/get-mocks">Get Mock Interviews</Link>
        </Button>
        <Button asChild variant="secondary" className="w-full">
          <Link href="/update-profile">Update Profile</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

