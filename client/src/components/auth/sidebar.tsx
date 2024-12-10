import { Home, Calendar, BarChart, BookOpen, Award, Bookmark } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { motion } from "framer-motion"
import { Audiowide } from 'next/font/google'

const audiowide = Audiowide({ subsets: ['latin'], weight: '400' })


export function Sidebar() {
  return (
    <aside className="w-[50%] bg-background hidden md:flex justify-center  border-r border-border h-screen sticky top-0 overflow-y-auto bg-white text-black">
      
    <div className='flex-col justify-center flex items-center h-[100vh]'>
        <div><Image
      src="/drdologo.jpeg"
      width={150}
      height={150}
      alt="DRDO LOGO"
      quality={100}
    /></div>
    


    <div className='flex items-center justify-center flex-col p-5'>

     <h1 className={`font-bold  text-3xl ${audiowide.className}`}>SkillMatrix</h1>

      <h2 className='mt-5 font-bold text-xl'>Redefining Recruitment with Intelligence and Fairness.</h2>
     <h2 className='text-sm mt-3'>"A game-changer for recruitment in high-stakes organizations like DRDO."</h2>
     </div>



</div>







      

    </aside>
  )
}

