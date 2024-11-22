import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InterviewTipsProps {
  className?: string;
}

export function InterviewTips({ className }: InterviewTipsProps) {
  const tips = [
    "Research the company beforehand",
    "Prepare questions for the interviewer",
    "Practice common interview questions",
    "Dress appropriately for the company culture",
    "Follow up with a thank-you note",
    "Be prepared to discuss your portfolio",
    "Highlight your problem-solving skills",
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Interview Tips</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="text-sm">{tip}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

