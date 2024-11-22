import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ProgressCardProps {
  className?: string;
}

export function ProgressCard({ className }: ProgressCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">Interviews Passed</h4>
            <Progress value={75}  className="w-full  " />
            <p className="text-sm text-muted-foreground mt-1">15 out of 20</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Skills Improved</h4>
            <Progress value={60} className="w-full" />
            <p className="text-sm text-muted-foreground mt-1">6 out of 10</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Mock Interviews Completed</h4>
            <Progress value={40} className="w-full" />
            <p className="text-sm text-muted-foreground mt-1">8 out of 20</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

