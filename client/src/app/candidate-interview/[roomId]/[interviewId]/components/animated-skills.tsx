"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface AnimatedSkillsProps {
  skills: string[]
}

export function AnimatedSkills({ skills }: AnimatedSkillsProps) {
  const [visibleSkills, setVisibleSkills] = useState<string[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSkills((prev) => {
        if (prev.length < skills.length) {
          return [...prev, skills[prev.length]]
        }
        return prev
      })
    }, 500) // Adjust this value to change the speed of appearance

    return () => clearInterval(timer)
  }, [skills])

  return (
    <div className="flex flex-wrap gap-2">
      <AnimatePresence>
        {visibleSkills.map((skill, index) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Badge variant="outline" className="text-[10px]">
              {skill}
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

