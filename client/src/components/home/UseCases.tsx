"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCheck, Users, UserPlus } from 'lucide-react'

const useCases = [
  {
    title: 'For Recruiters',
    description: 'Save time and focus on top candidates with our streamlined process.',
    icon: UserCheck,
  },
  {
    title: 'For Hiring Managers',
    description: 'Simplify team collaboration and make data-driven hiring decisions.',
    icon: Users,
  },
  {
    title: 'For Candidates',
    description: 'Experience a smooth and stress-free interview process.',
    icon: UserPlus,
  },
]

const UseCases = () => {
  return (
    <section id="use-cases" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center mb-12">Who Can Benefit from Our App?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-black border-white border-opacity-10 hover:border-opacity-50
transition-all duration-300">
                <CardHeader>
                  <useCase.icon className="w-12 h-12 mb-4 text-white" />
                  <CardTitle className="text-white">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{useCase.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UseCases

