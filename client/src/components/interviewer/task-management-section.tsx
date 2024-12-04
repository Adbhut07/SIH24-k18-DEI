"use client"

import { useState } from "react"
import { CheckCircle2, Circle, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialTasks = [
  { id: 1, description: "Submit feedback for John Doe's interview", completed: false },
  { id: 2, description: "Prepare questions for upcoming panel discussion", completed: false },
  { id: 3, description: "Review candidate resumes for next week's interviews", completed: true },
  { id: 4, description: "Update interview scorecard template", completed: false },
]

export function TaskManagementSection() {
  const [tasks, setTasks] = useState(initialTasks)
  const [newTask, setNewTask] = useState("")

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), description: newTask, completed: false }])
      setNewTask("")
    }
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const progressPercentage = (completedTasks / totalTasks) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Task Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <Button variant="default" onClick={addTask}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center space-x-2">
                <button onClick={() => toggleTask(task.id)}>
                  {task.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-300" />
                  )}
                </button>
                <span className={task.completed ? "line-through text-gray-500" : ""}>
                  {task.description}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm font-semibold mb-2">Task Completion Progress</p>
          <Progress value={progressPercentage} />
          <p className="text-sm text-muted-foreground mt-1">
            {completedTasks} out of {totalTasks} tasks completed
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

