import { Bell, HelpCircle, Home, Search } from 'lucide-react'
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
import Logout from '../Logout'
import { useAppSelector } from '@/lib/store/hooks'

export function Navbar() {

  const user = useAppSelector((state)=>state.user)

  const paths = ['/dashboard-admin','/dashboard-candidate','/dashboard-interviewer']
  let dashboardPath;

  if (user.role=='CANDIDATE'){
     dashboardPath = paths[1];
  }
  else if (user.role == 'ADMIN'){
    dashboardPath = paths[0]
  }
  else{
    dashboardPath = paths[2]
  }

  return (
    <nav className="sticky top-0 z-10 bg-background border-b border-border bg-gray-800">
      <div className="container mx-auto px-4 py-2 flex items-center justify-end">
        <div className="flex p-2 gap-4  justify-center items-center space-x-4">

        <Link href={'/'}>
  <Button
    variant="ghost"
    size="sm"
    className="text-white hover:bg-gray-600 hover:text-white transition-colors"
  >
    <Home className="h-4 w-4 mr-2" />
    Home
  </Button>
</Link>

<Link href={'/faq'}>
  <Button
    variant="ghost"
    size="sm"
    className="text-white hover:bg-gray-600 hover:text-white transition-colors"
  >
    <HelpCircle className="h-4 w-4 mr-2" />
    FAQ
  </Button>
</Link>


       <Link href={dashboardPath}> 
       <Button  variant="ghost" size="sm" className="text-white hover:bg-gray-600 hover:text-white">
        <LayoutDashboard className="h-4 w-4 mr-2" />
        Dashboard
      </Button>
      </Link>  
      
       <Logout/>
          
        </div>
      </div>
    </nav>
  )
}

