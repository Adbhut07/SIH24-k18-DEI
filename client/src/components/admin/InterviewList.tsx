import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function InterviewList() {
  const [filters, setFilters] = useState({
    candidate: "",
    position: "",
    status: "",
    dateRange: "",
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label htmlFor="candidate-search">Candidate</Label>
            <Input
              id="candidate-search"
              placeholder="Search by name"
              value={filters.candidate}
              onChange={(e) => handleFilterChange("candidate", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="position-search">Position</Label>
            <Input
              id="position-search"
              placeholder="Search by position"
              value={filters.position}
              onChange={(e) => handleFilterChange("position", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="status-filter">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date-range">Date Range</Label>
            <Input
              id="date-range"
              type="date"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>Software Engineer</TableCell>
              <TableCell>2023-06-15</TableCell>
              <TableCell>Scheduled</TableCell>
              <TableCell>
                <Button variant="link">View Details</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane Smith</TableCell>
              <TableCell>Product Manager</TableCell>
              <TableCell>2023-06-16</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>
                <Button variant="link">View Report</Button>
              </TableCell>
            </TableRow>
            {/* Add more rows as needed */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

