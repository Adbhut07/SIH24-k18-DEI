import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Users, Brain, Shield } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <Video className="h-8 w-8" />,
      title: "Virtual Boardroom",
      description: "Conduct interviews in a secure, virtual environment."
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Assisted Interviews",
      description: "Leverage AI to enhance the interview process and decision-making."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Collaborative Tools",
      description: "Real-time collaboration features for interview panels."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Platform",
      description: "Military-grade security for sensitive interviews and data."
    },
  ]

  return (
    <div id="features" className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Our Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                {feature.icon}
                <span className="ml-2 text-blue-700 font-bold">{feature.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

