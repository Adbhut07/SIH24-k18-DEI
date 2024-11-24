import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function UserSearch() {
  const [email, setEmail] = useState("")
  const [userFound, setUserFound] = useState<boolean | null>(null)

  const handleSearch = () => {
    // Simulating user search
    setUserFound(Math.random() > 0.5)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Search</h2>
      <div className="flex space-x-2">
        <div className="flex-grow">
          <Label htmlFor="email-search">Email</Label>
          <Input
            id="email-search"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button onClick={handleSearch} className="mt-auto">Search</Button>
      </div>
      {userFound === false && (
        <div>
          <p className="text-red-500">User not found</p>
          <Button>Create User with {email}</Button>
        </div>
      )}
    </div>
  )
}

