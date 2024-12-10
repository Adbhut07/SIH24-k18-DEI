import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const words = ['Smarter','Faster','Better','Reliable','Efficient']

export function AnimatedHeroText() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  // Change the word every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="flex-1 flex flex-col justify-center"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
      <motion.span
          key={words[currentWordIndex]} // Use key to ensure the word changes correctly
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="inline-block text-orange-500"
        >
          {words[currentWordIndex]}
        </motion.span>{' '} 
        DRDO: AI-Powered Interviews with Real-Time Relevance
      </h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="text-xl text-gray-600"
      >
        Experience the power of AI-driven interviews
      </motion.p>
    </motion.div>
  )
}
