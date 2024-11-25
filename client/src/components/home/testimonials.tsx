"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'John Doe',
    role: 'HR Manager',
    company: 'Tech Corp',
    content: 'InterviewPro has transformed our hiring process. It\'s efficient, insightful, and easy to use.',
    avatar: '/placeholder.svg?height=100&width=100',
    rating: 5,
  },
  {
    name: 'Jane Smith',
    role: 'Talent Acquisition Specialist',
    company: 'InnovateCo',
    content: 'The AI-driven skill assessments have significantly improved our candidate evaluation process.',
    avatar: '/placeholder.svg?height=100&width=100',
    rating: 4,
  },
  {
    name: 'Mike Johnson',
    role: 'CTO',
    company: 'StartupX',
    content: 'InterviewPro\'s collaboration features have made our remote hiring seamless and effective.',
    avatar: '/placeholder.svg?height=100&width=100',
    rating: 5,
  },
]

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center mb-12">What Our Users Say</h2>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-black border-white border-opacity-10">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="mr-4">
                      <AvatarImage src={testimonials[activeIndex].avatar} alt={testimonials[activeIndex].name} />
                      <AvatarFallback>{testimonials[activeIndex].name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-white">{testimonials[activeIndex].name}</h3>
                      <p className="text-sm text-gray-400">{testimonials[activeIndex].role}, {testimonials[activeIndex].company}</p>
                    </div>
                  </div>
                  <p className="text-lg mb-4 text-gray-300">{testimonials[activeIndex].content}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < testimonials[activeIndex].rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full mx-2 ${index === activeIndex ? 'bg-white' : 'bg-gray-600'}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials

