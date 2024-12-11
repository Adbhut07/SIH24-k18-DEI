import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ERDiagram() {
  const entities = [
    {
      name: "User",
      attributes: [
        { name: "id", type: "UUID", isPK: true },
        { name: "name", type: "String" },
        { name: "email", type: "String", isUnique: true },
        { name: "password", type: "String" },
        { name: "role", type: "Role" },
        { name: "createdAt", type: "DateTime" },
        { name: "updatedAt", type: "DateTime" },
      ],
      relationships: [
        "Has many Interviews as candidate",
        "Has many InterviewInterviewers as interviewer",
        "Has one CandidateProfile",
      ],
    },
    {
      name: "CandidateProfile",
      attributes: [
        { name: "id", type: "UUID", isPK: true },
        { name: "candidateId", type: "UUID", isFK: true },
        { name: "name", type: "String" },
        { name: "designation", type: "String" },
        { name: "age", type: "Int" },
        { name: "location", type: "String" },
        { name: "aadharNumber", type: "String", isUnique: true },
        { name: "email", type: "String", isUnique: true },
        { name: "phoneNumber", type: "String", isUnique: true },
        { name: "summary", type: "String" },
        { name: "resume", type: "String" },
        { name: "medicalReport", type: "String" },
        { name: "image", type: "String" },
        { name: "tenthMarks", type: "String" },
        { name: "twelfthMarks", type: "String" },
        { name: "gateScore", type: "String" },
        { name: "jeeScore", type: "String" },
        { name: "experience", type: "Json" },
        { name: "education", type: "Json" },
        { name: "skills", type: "String[]" },
        { name: "achievements", type: "String[]" },
        { name: "createdAt", type: "DateTime" },
        { name: "updatedAt", type: "DateTime" },
      ],
      relationships: ["Belongs to one User"],
    },
    {
      name: "Interview",
      attributes: [
        { name: "id", type: "UUID", isPK: true },
        { name: "title", type: "String" },
        { name: "description", type: "String" },
        { name: "candidateId", type: "UUID", isFK: true },
        { name: "scheduledAt", type: "DateTime" },
        { name: "roomId", type: "String" },
        { name: "type", type: "InterviewType" },
        { name: "status", type: "InterviewStatus" },
        { name: "createdAt", type: "DateTime" },
        { name: "updatedAt", type: "DateTime" },
      ],
      relationships: [
        "Belongs to one User as candidate",
        "Has many InterviewInterviewers",
        "Has one Evaluation",
        "Uses one Room",
      ],
    },
    {
      name: "InterviewInterviewer",
      attributes: [
        { name: "id", type: "UUID", isPK: true },
        { name: "interviewId", type: "UUID", isFK: true },
        { name: "interviewerId", type: "UUID", isFK: true },
      ],
      relationships: [
        "Belongs to one Interview",
        "Belongs to one User as interviewer",
      ],
    },
    {
      name: "Room",
      attributes: [
        { name: "id", type: "String", isPK: true },
        { name: "appId", type: "String", isUnique: true },
        { name: "channel", type: "String", isUnique: true },
        { name: "appCertificate", type: "String" },
        { name: "inUse", type: "Boolean" },
      ],
      relationships: ["Used by one Interview"],
    },
    {
      name: "Evaluation",
      attributes: [
        { name: "id", type: "UUID", isPK: true },
        { name: "interviewId", type: "UUID", isFK: true },
        { name: "questionDetails", type: "Json" },
        { name: "feedbackInterviewer", type: "Json" },
        { name: "feedbackCandidate", type: "Json" },
        { name: "relevancyAI", type: "Float" },
        { name: "relevancyCandidate", type: "Float" },
        { name: "idealAnswerAI", type: "Json" },
        { name: "marksAI", type: "Float" },
        { name: "createdAt", type: "DateTime" },
        { name: "updatedAt", type: "DateTime" },
      ],
      relationships: ["Belongs to one Interview"],
    },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ER Diagram: Interview Management System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entities.map((entity) => (
          <Card key={entity.name} className="w-full">
            <CardHeader>
              <CardTitle>{entity.name}</CardTitle>
              <CardDescription>Entity</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="attributes">
                  <AccordionTrigger>Attributes</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside">
                      {entity.attributes.map((attr) => (
                        <li key={attr.name} className="mb-1">
                          {attr.name}: {attr.type}{" "}
                          {attr.isPK && <Badge variant="outline">PK</Badge>}{" "}
                          {attr.isFK && <Badge variant="outline">FK</Badge>}{" "}
                          {attr.isUnique && <Badge variant="outline">UK</Badge>}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="relationships">
                  <AccordionTrigger>Relationships</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside">
                      {entity.relationships.map((rel, index) => (
                        <li key={index}>{rel}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

