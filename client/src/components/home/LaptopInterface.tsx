'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Video, PhoneOff, Loader2, User, Users, Radio, Timer } from 'lucide-react'

const questions = [
  "Tell me about yourself.",
  "What are your greatest strengths?",
  "Where do you see yourself in 5 years?",
  "Why do you want to work here?",
  "What's your biggest professional achievement?",
  "How do you handle stress and pressure?",
  "Describe a challenging work situation and how you overcame it.",
  "What are your salary expectations?",
  "Do you have any questions for us?",
  "Why should we hire you?"
]

export default function LaptopInterface() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [relevancy, setRelevancy] = useState(85)
  const [isLive, setIsLive] = useState(false)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLive) {
      interval = setInterval(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setIsLoading(true)
          setTimeout(() => {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1)
            setIsLoading(false)
            setRelevancy(Math.floor(Math.random() * (100 - 70 + 1) + 70))
          }, 2000)
        }
        setTimer(prevTimer => prevTimer + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [currentQuestionIndex, isLive])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    
    
    <motion.div 
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-[700px]  mr-10 aspect-[16/10] bg-white rounded-xl shadow-xl overflow-hidden border-8 border-gray-800 relative"
  >

  
        {/* Laptop Top Bar */}
        <div className="h-5 bg-gray-800 flex items-center px-3 gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        
        {/* Main Content */}
        <div className="p-4 bg-gray-100 h-[calc(100%-20px)] flex">
          {/* Video Call Interface */}
          <div className="flex-grow relative bg-gray-900 rounded-lg overflow-hidden">
            {/* Main video (interviewee) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            >
              <User className="w-32 h-32 text-white opacity-50" />
            </motion.div>
            
            {/* Interviewer thumbnails */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-3 right-3 w-full  h-18  rounded-lg overflow-hidden flex items-center justify-end"
            >
              <Users className="w-5 h-5 text-white opacity-50" />
            </motion.div>
            
            {/* Control icons */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
              >
                <Mic className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
              >
                <Video className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
              >
                <PhoneOff className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Live indicator and timer */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute top-3 left-3 flex items-center space-x-2"
            >
              <motion.div 
                animate={{ scale: isLive ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500' : 'bg-gray-500'}`} 
              />
              <span className="text-white text-sm font-medium">LIVE</span>
              <div className="bg-gray-800 rounded px-2 py-1 flex items-center text-xs">
                <Timer className="w-4 h-4 text-white mr-1" />
                <span className="text-white text-sm">{formatTime(timer)}</span>
              </div>
            </motion.div>
          </div>
          
          {/* AI-Generated Questions Panel */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-64 ml-4 bg-white rounded-lg p-3 flex flex-col"
          >
            <h2 className="text-lg font-bold mb-3">AI-Generated Questions</h2>
            
            {/* Question display */}
            <div className="flex-grow overflow-y-auto mb-3">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2 text-gray-500"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Generating question...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="bg-gray-100 p-3 rounded-lg shadow"
                  >
                    <p className="text-sm text-gray-800">{questions[currentQuestionIndex]}</p>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 30 }}
                      className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        relevancy >= 80 ? 'bg-green-100 text-green-800' : 
                        relevancy >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {relevancy}% Relevant
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Progress bar */}
            <div>
              <div className="text-xs text-gray-600 mb-1">
                Answered: {currentQuestionIndex + 1}/{questions.length}
              </div>
              <motion.div 
                className="h-1.5 bg-gray-200 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="h-full bg-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
              </motion.div>
            </div>

            {/* Live button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLive(!isLive)}
              className={`mt-4 px-4 py-2 rounded-full text-white font-medium ${
                isLive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              } transition-colors flex items-center justify-center`}
            >
              <Radio className="w-4 h-4 mr-2" />
              {isLive ? 'End Interview' : 'Start Interview'}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
  
    
  )
}

