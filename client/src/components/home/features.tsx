"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Brain, FileText, Network, Users, FileCode2 } from 'lucide-react'

const features = [
  {
    title: 'Automated Scheduling',
    description: 'Effortlessly coordinate interviews with AI-powered scheduling.',
    icon: Calendar,
  },
  {
    title: 'AI-driven Skill Assessment',
    description: 'Accurately evaluate candidates with our advanced AI algorithms.',
    icon: Brain,
  },
  {
    title: 'Detailed Feedback Reports',
    description: 'Generate comprehensive reports for informed decision-making.',
    icon: FileText,
  },
  {
    title: 'ATS Integration',
    description: 'Seamlessly integrate with your existing Applicant Tracking Systems.',
    icon: Network,
  },
  {
    title: 'Real-time Collaboration',
    description: 'Collaborate with your team in real-time during the interview process.',
    icon: Users,
  },
  {
    title: 'Customizable Templates',
    description: 'Create and use tailored interview templates for consistency.',
    icon: FileCode2,
  },
]

const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-black border-white border-opacity-10 hover:border-opacity-50 transition-all duration-300">
                <CardHeader>
                  <feature.icon className="w-10 h-10 mb-4 text-white" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features

