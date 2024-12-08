"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Bell, Home, Calendar, Clock, Settings, LogOut, Sun, Moon, User, Users, BookOpen } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Logout from "../Logout"
import { Audiowide } from "next/font/google"

const audiowide = Audiowide({ subsets: ['latin'], weight: '400' })

export function Navbar() {
  const [notifications, setNotifications] = useState([
    "Interview with John Doe starts in 30 minutes",
    "Complete feedback for 3 interviews",
  ])


  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-800 text-white shadow-lg">
    <div className="container mx-auto px-6">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-6">
          <Link href={'/'}>
          <span className={`text-xl font-bold ${audiowide.className} `}>Skill Matrix</span>

          </Link>
         
  
          <a href="#upcoming">
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-600 hover:text-white transition-colors">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming
          </Button>
          </a>

          <a href="#past">

          <Button  variant="ghost" size="sm" className="text-white hover:bg-gray-600 hover:text-white transition-colors">
            <Clock className="h-5 w-5 mr-2" />
            Past
          </Button>
          </a>

          <a href="#collaboration">
  <Button
    variant="ghost"
    size="sm"
    className="text-white hover:bg-gray-600 hover:text-white transition-colors"
  >
    <Users className="h-5 w-5 mr-2" />
    Collaboration
  </Button>
</a>

<a href="#notes">
  <Button
    variant="ghost"
    size="sm"
    className="text-white hover:bg-gray-600 hover:text-white transition-colors"
  >
    <BookOpen className="h-5 w-5 mr-2" />
    Notes
  </Button>
</a>
          
        </div>
  
        <div className="flex items-center space-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-white hover:text-white hover:bg-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-orange-500 rounded-full text-xs">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-gray-700 text-white rounded-md shadow-lg">
              {notifications.map((notification, index) => (
                <DropdownMenuItem key={index} className="hover:bg-gray-600 px-4 py-2">
                  {notification}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
  
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-600 hover:text-white transition-colors" asChild>
            <Link href="/profile" className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile
            </Link>
          </Button>
  
          <Logout />
        </div>
      </div>
    </div>
  </nav>
  
  )
}

