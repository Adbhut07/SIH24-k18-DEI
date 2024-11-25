"use client"

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[...Array(20)].map((_, i) => (
            <motion.path
              key={i}
              d={`M${Math.random() * 100} ${Math.random() * 100} L${Math.random() * 100} ${Math.random() * 100}`}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </svg>
      </div>
      <div className="z-10 text-center">
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Automating the Interview Process
          </span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Streamline interview scheduling, skill assessment, and feedback in one trusted platform.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href={'/auth/signin'}><Button size="lg" className="mr-4 bg-white text-black hover:bg-gray-200">Get Started</Button> </Link> 
         <Link href={'/aboutus'}> <Button size="lg" variant="outline" className="border-white text-black hover:bg-gray-200 hover:text-black">Learn More</Button></Link>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

