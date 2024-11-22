import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Play } from 'lucide-react'

const recordings = [
  { id: 1, title: "Frontend Developer Interview", date: "2023-05-10", duration: "45:30" },
  { id: 2, title: "Backend Developer Interview", date: "2023-05-05", duration: "52:15" },
  { id: 3, title: "Full Stack Developer Interview", date: "2023-04-28", duration: "58:45" },
]

export default function LastRecordingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Last Interview Recordings</h1>
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Recordings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recordings.map((recording) => (
                    <TableRow key={recording.id}>
                      <TableCell>{recording.title}</TableCell>
                      <TableCell>{recording.date}</TableCell>
                      <TableCell>{recording.duration}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Play className="w-4 h-4 mr-1" /> Play
                          </Button>
                          <Button size="sm" className="hover:bg-blue-800 hover:text-white" variant="outline">
                            <Download className="w-4 h-4 mr-1" /> Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

