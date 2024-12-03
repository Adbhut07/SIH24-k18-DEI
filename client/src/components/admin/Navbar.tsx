import { Bell, Settings, User, HomeIcon, LogOutIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Logout from '../Logout'

export function Navbar() {
  return (
    <nav className="border-b bg-background fixed top-0 left-0 right-0 z-50">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-2xl font-bold">SkillMatrix</h1>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <HomeIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          

           <Logout />

          
        </div>
      </div>
    </nav>
  )
}

