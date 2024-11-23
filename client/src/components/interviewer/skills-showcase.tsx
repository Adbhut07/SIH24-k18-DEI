import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SkillsShowcase() {
  const skills = ["React", "Node.js", "TypeScript", "Python", "AWS", "Docker"]
  const projects = [
    { id: 1, title: "E-commerce Platform", description: "Built with Next.js and Stripe" },
    { id: 2, title: "Task Management App", description: "React Native mobile application" },
    { id: 3, title: "Data Visualization Dashboard", description: "Created using D3.js and Vue.js" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Projects</h3>
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <h4 className="font-medium">{project.title}</h4>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

