import { Bell, HelpCircle, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { HomeIcon,House,CircleHelp,LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="container mx-auto px-4 py-2 flex items-center justify-end">
        <div className="flex p-2 gap-4  justify-center items-center space-x-4">

       <Link href='/'> <House className='w-4 h-4' /></Link>
         <CircleHelp className='w-4 h-4' />
       <Link href='/dashboard-candidate'> <LayoutDashboard className='w-4 h-4' /></Link>


          
        </div>
      </div>
    </nav>
  )
}

