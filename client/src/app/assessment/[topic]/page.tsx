'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OpenAI from 'openai'
import { useParams } from 'next/navigation'


const Assessment = () =>{


    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      })


      const {topic} = useParams()

      const prompt = `Generate 15 questions related to ${topic} in a comma separted values`

      const [questions, setQuestions] = React.useState<string[]>([])

        const handleGenerateQuestions = async () => {
           try{
            const completion = await openai.chat.completions.create({
                model: "meta-llama/llama-3.2-3b-instruct:free",
                messages: [
                  {
                    role: "user",
                    content: prompt,
                   },
                ],
              });
          
              const responseContent = completion?.choices?.[0]?.message?.content;

                if (responseContent) {
                    const questions = responseContent.split(",");
                    setQuestions(questions);
                } else {
                    throw new Error("No content received from the AI model.");
                }
              if (!responseContent) {
                throw new Error("No content received from the AI model.");
              }
           } catch (error) {
               console.error("Error generating questions:", error);
           }
        }
        




      useEffect(()=>{

        handleGenerateQuestions()


      },[])





    return (


        <AnimatePresence>
      {questions?.map((question, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <div className="bg-card text-card-foreground p-4 rounded-lg mb-4 shadow-sm">
            <p className="text-lg">{question}</p>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
    )
}


export default Assessment