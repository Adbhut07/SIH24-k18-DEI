"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { CalendarSearch, ExternalLink, LogInIcon, LucideLogIn, UserSearch } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import { Audiowide } from "next/font/google"
import AnimatedHero from "@/components/home/AnimatedHero"
import InterviewPlatform from "@/components/home/LaptopInterface"
import InterviewInterface from "@/components/home/InterviewInterface"
import Link from "next/link"


const audiowide = Audiowide({ subsets: ["latin"], weight: "400" })

export default function LandingPage() {
  const solutionsRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: solutionsRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effect */}
      <div className="fixed inset-0 w-screen h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(255, 165, 0, 0.1) 0%, transparent 70%)",
          }}
        />
        <svg 
          className="absolute inset-0 w-full h-full" 
          xmlns="http://www.w3.org/2000/svg" 
          preserveAspectRatio="none"
          viewBox="0 0 1440 400"
        >
          <motion.path
            d="M0,128 C360,160 720,192 1080,192 C1440,192 1800,160 2160,128 L2160,400 L0,400 Z"
            fill="none"
            stroke="rgba(255, 165, 0, 0.2)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M0,96 C360,64 720,32 1080,32 C1440,32 1800,64 2160,96 L2160,400 L0,400 Z"
            fill="none"
            stroke="rgba(255, 165, 0, 0.2)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          />
        </svg>
      </div>

      {/* Navigation */}
      <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-black backdrop-blur-md"
    >
      <div className={`text-xl font-bold text-white ${audiowide.className}`}>Skill Matrix</div>
      <div className="hidden md:flex items-center space-x-8">

        <a href="#" className="text-white hover:text-orange-400 transition-colors">Overview</a>
        <a href="#" className="text-white hover:text-orange-400 transition-colors">Technology</a>
        <a href="#" className="text-white hover:text-orange-400 transition-colors">Testimonials</a>
        <a href="#" className="text-white hover:text-orange-400 transition-colors">Resources</a>
      </div>
      <div className="flex items-center space-x-4 ">
        <Link href={'/auth/signin'} className="flex gap-1 items-center ">
        <Button className="bg-transparent">Log In</Button>
        <LucideLogIn height={15} width={15}/>
        </Link>
      </div>
    </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 mt-[14vh]">
        <div className="container  mx-auto px-6 pt-20 pb-32 text-center">
          {/* Chip Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-32 h-32 mx-auto mb-12 relative"
          >
            <div className="absolute inset-0 rounded-xl border-2 border-orange-500 bg-black/50 backdrop-blur-sm">
              <div className="absolute inset-2 grid grid-cols-4 gap-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-orange-500/20 rounded-sm"
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">Skill  Matrix</span>
              </div>
            </div>
            <motion.div
              className="absolute inset-0 rounded-xl bg-orange-500/20 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>

          {/* Main Text */}
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className=" mb-6 flex flex-col gap-2"
          >
           <span className="text-5xl font-bold">AI-Backed Interviews</span> 
            
             {/* <span className="2xl ">Precision, Fairness, and Simplicity  </span> */}
          </motion.h1>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-xl text-gray-400 mb-12"
          >
            Smart, Fair, and Efficient AI-Driven Interviews<br />
            by DRDO
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-full text-lg">
              Get Started
              <UserSearch />
            </Button>
          </motion.div>

          {/* Preorder Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="text-gray-400 mt-12"
          >
            Serving since 2024
          </motion.p>

          {/* Platform Cards */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto"
          >
            {[
              { title: "About Us", subtitle: "How do we use AI?" },
              { title: "FAQ", subtitle: "Have some questions?" },
              { title: "Policies", subtitle: "Get Details About Policies" },
            ].map((platform, index) => (
              <motion.div
                key={index}
                className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 flex flex-col items-center hover:border-orange-500 transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ExternalLink className="w-6 h-6 mb-4 text-orange-500" />
                <h3 className="font-semibold">{platform.title}</h3>
                <p className="text-gray-400 text-sm">{platform.subtitle}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Solutions Section with Particles */}
        <div ref={solutionsRef} className="min-h-screen relative overflow-hidden">
          {/* Particles Background */}
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-orange-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
                x: [0, Math.random() * 100 - 50, 0],
                y: [0, Math.random() * 100 - 50, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
          
          {/* Content */}
     
      <AnimatedHero />

      <InterviewInterface />
     

        </div>
      </div>
    </div>
  )
}

