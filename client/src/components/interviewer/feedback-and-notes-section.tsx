"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const candidates = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
  { id: 4, name: "Alice Williams" },
]

export function FeedbackAndNotesSection() {
  const [candidateFeedback, setCandidateFeedback] = useState("")
  const [panelFeedback, setPanelFeedback] = useState("")
  const [sharedNotes, setSharedNotes] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSubmit = (type: string) => {
    console.log(`Submitting ${type} feedback for candidate ${selectedCandidate}:`, type === 'candidate' ? candidateFeedback : panelFeedback)
    if (type === 'candidate') {
      setCandidateFeedback("")
    } else {
      setPanelFeedback("")
    }
  }

  const handleSaveNotes = () => {
    console.log("Saving shared notes:", sharedNotes)
  }

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card id="notes">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Feedback and Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
            <SelectTrigger>
              <SelectValue placeholder="Select a candidate" />
            </SelectTrigger>
            <SelectContent>
              {filteredCandidates.map(candidate => (
                <SelectItem key={candidate.id} value={candidate.name}>
                  {candidate.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Tabs defaultValue="candidate">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="candidate">Candidate Feedback</TabsTrigger>
            <TabsTrigger value="panel">Panel Feedback</TabsTrigger>
            <TabsTrigger value="notes">Shared Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="candidate">
            <Textarea
              placeholder="Enter feedback for the candidate..."
              value={candidateFeedback}
              onChange={(e) => setCandidateFeedback(e.target.value)}
              rows={5}
              className="mb-4"
            />
            <Button variant="default" onClick={() => handleSubmit('candidate')} disabled={!selectedCandidate}>Submit Candidate Feedback</Button>
          </TabsContent>
          <TabsContent value="panel">
            <Textarea
              placeholder="Enter feedback for the panel..."
              value={panelFeedback}
              onChange={(e) => setPanelFeedback(e.target.value)}
              rows={5}
              className="mb-4"
            />
            <Button variant="default" onClick={() => handleSubmit('panel')} disabled={!selectedCandidate}>Submit Panel Feedback</Button>
          </TabsContent>
          <TabsContent value="notes">
            <Textarea
              placeholder="Enter shared notes for the team..."
              value={sharedNotes}
              onChange={(e) => setSharedNotes(e.target.value)}
              rows={5}
              className="mb-4"
            />
            <Button className="bg-gray-800" variant="default" onClick={handleSaveNotes}>Save Shared Notes</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

