"use client"

import { motion, useScroll, useTransform, useSpring, useMotionValue, useAnimationFrame } from "framer-motion"
import { useRef, useEffect, useState } from "react"

export default function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange(v => console.log('Scroll progress:', v))
    return () => unsubscribe()
  }, [scrollYProgress])

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50])

  // Enhanced animation for the 'AI' text
  const aiScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 2.5, 1.5])
  const aiRotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, 360, 0])

  // Floating animation for the "Solutions" badge
  const floatY = useMotionValue(0)
  useAnimationFrame((t) => {
    floatY.set(Math.sin(t / 1000) * 10)
  })

  // Parallax effect for background shapes
  const shape1X = useTransform(scrollYProgress, [0, 1], [0, -100])
  const shape2X = useTransform(scrollYProgress, [0, 1], [0, 100])
  const shape3Y = useTransform(scrollYProgress, [0, 1], [0, -150])

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const mouseX = useSpring(useMotionValue(0), { stiffness: 500, damping: 100 })
  const mouseY = useSpring(useMotionValue(0), { stiffness: 500, damping: 100 })

  useEffect(() => {
    mouseX.set(mousePosition.x / 50)
    mouseY.set(mousePosition.y / 50)
  }, [mousePosition, mouseX, mouseY])

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden"
    >
     

      <div className="container mx-auto px-6 py-32 relative">
        <motion.div
          style={{ opacity, y }}
          className="text-center space-y-6 hover:cursor-pointer"
        >
          <motion.div 
            className="inline-block  px-4 py-1 rounded-full border border-green-400 text-green-400 text-sm mb-6"
            // style={{ y: floatY }}
            whileHover={{ scale: 1.05, boxShadow: "0px 5px 10px rgba(0,0,0,0.1)" }}
          >
            Solutions
          </motion.div>
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold relative">
              <motion.span 
                style={{ x: mouseX, y: mouseY }}
                className="inline-block"
              >
                <span className="text-black mr-10">Empowering</span>
                <motion.span
                  style={{
                    display: 'inline-block',
                    scale: aiScale,
                    rotate: aiRotate,
                  }}
                  className="inline-block origin-center text-orange-400"
                >
                  AI
                </motion.span>
                <span className="ml-10 text-black">with Transparency</span>
              </motion.span>
              <br />
              <motion.span 
                className="text-orange-400 inline-block mt-10 text-6xl"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
                style={{
                  backgroundSize: "200% 200%",
                  backgroundImage: "linear-gradient(90deg, #f59e0b, #ef4444, #f59e0b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Transforming the Future
              </motion.span>
            </h2>
          </div>
        </motion.div>

      
      </div>
    </div>
  )
}

