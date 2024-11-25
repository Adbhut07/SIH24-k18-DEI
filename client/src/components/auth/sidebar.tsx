import { Home, Calendar, BarChart, BookOpen, Award, Bookmark } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { motion } from "framer-motion"
export function Sidebar() {
  return (
    <aside className="w-[50%] bg-background border-r border-border h-screen sticky top-0 overflow-y-auto bg-white text-black">
      
    <div className='flex flex-col justify-center items-center h-[100vh]'>
        <div><Image
      src="/drdologo.jpeg"
      width={150}
      height={150}
      alt="DRDO LOGO"
      quality={100}
    /></div>
    


    <div className='flex items-center flex-col p-5'>
     <h1 className='font-bold text-4xl'>SkillMatrix</h1>
      <h2 className='font-bold text-xl'>Redefining Recruitment with Intelligence and Fairness.</h2>
     <h2 className='text-sm'>"A game-changer for recruitment in high-stakes organizations like DRDO."</h2>
     </div>



</div>







      

    </aside>
  )
}

