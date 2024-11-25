"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    question: 'How does the app work?',
    answer: 'InterviewPro streamlines your interview process by providing automated scheduling, AI-driven skill assessments, and collaborative tools for your team. Simply set up your account, create interview templates, and start inviting candidates.',
  },
  {
    question: 'Can I integrate this with my existing HR tools?',
    answer: 'Yes, InterviewPro offers integrations with popular Applicant Tracking Systems (ATS) and other HR tools. Our API also allows for custom integrations with your existing workflow.',
  },
  {
    question: 'What kind of skill assessments are included?',
    answer: 'We offer a wide range of skill assessments, including technical skills (e.g., coding, data analysis) and soft skills (e.g., communication, problem-solving). Our AI-driven assessments adapt to your specific needs and job requirements.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We take data security very seriously. All data is encrypted in transit and at rest, and we comply with GDPR and other relevant data protection regulations.',
  },
]

const FAQ = () => {
  const [openItem, setOpenItem] = useState<string | null>(null)

  return (
    <section id="faq" className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center mb-12">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-white border-opacity-10">
              <AccordionTrigger
                onClick={() => setOpenItem(openItem === `item-${index}` ? null : `item-${index}`)}
                className="text-white hover:text-gray-300"
              >
                {faq.question}
              </AccordionTrigger>
              <AnimatePresence>
                {openItem === `item-${index}` && (
                  <AccordionContent>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-300"
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                )}
              </AnimatePresence>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export default FAQ

