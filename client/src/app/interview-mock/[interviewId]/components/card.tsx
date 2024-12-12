import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface JobCardProps {
  title: string
  description: string
  jobId: string
}

export function JobCard({ title, description, jobId }: JobCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="text-xs font-medium">
          Job ID: <span className="font-normal">{jobId}</span>
        </div>
      </CardContent>
    </Card>
  )
}
