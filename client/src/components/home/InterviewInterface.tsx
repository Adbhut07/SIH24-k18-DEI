import React from 'react'
import LaptopInterface from './LaptopInterface'
import { AnimatedHeroText } from './AnimatedHeroText'

export default function InterviewInterface() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 pt-20 flex items-center justify-center">
      <div className="w-full max-w-[1200px] flex flex-col md:flex-row gap-8">
        <LaptopInterface />
        <AnimatedHeroText />
      </div>
    </div>
  )
}

