'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageSquare, LogIn, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { io, Socket } from "socket.io-client"

interface Message {
  id: string
  sender: string
  message: string
}

export default function ChatCard() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  const [joined, setJoined] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const connectSocket = useCallback(() => {
    if (roomId.trim() && username.trim()) {
      const newSocket = io(`${process.env.NEXT_PUBLIC_API_ENDPOINT}`, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })

      newSocket.on("connect", () => {
        console.log(`Connected to server. Socket ID: ${newSocket.id}`)
        newSocket.emit("joinRoom", roomId)
        setJoined(true)
        setSocket(newSocket)
        setConnectionError(null)
      })

      newSocket.on("receiveMessage", (data: Message) => {
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(msg => msg.id === data.id)
          if (!messageExists) {
            return [...prevMessages, data]
          }
          return prevMessages
        })
      })

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error)
        setConnectionError(`Connection failed: ${error.message}`)
      })

      newSocket.on("disconnect", (reason) => {
        console.log("Disconnected:", reason)
        setConnectionError(`Disconnected: ${reason}`)
      })

      return () => {
        newSocket.disconnect()
      }
    }
  }, [roomId, username])

  useEffect(() => {
    if (joined && roomId && username) {
      const cleanup = connectSocket()
      return () => {
        cleanup && cleanup()
      }
    }
  }, [joined, roomId, username, connectSocket])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleJoin = () => {
    if (roomId.trim() && username.trim()) {
      connectSocket()
    }
  }

  const handleLeave = () => {
    if (socket) {
      socket.emit("leaveRoom", roomId)
      socket.disconnect()
    }
    
    setSocket(null)
    setJoined(false)
    setMessages([])
    setRoomId("")
    setUsername("")
    setConnectionError(null)
  }

  const sendMessage = () => {
    if (inputMessage.trim() && socket) {
      const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      const messageData = { 
        id: messageId,
        roomId, 
        message: inputMessage, 
        sender: username 
      }
      
      socket.emit("sendMessage", messageData)
      
      setMessages((prevMessages) => [
        ...prevMessages, 
        { 
          id: messageId,
          sender: username, 
          message: inputMessage 
        }
      ])
      
      setInputMessage("")
    }
  }

  return (
    <Card className="w-1/5 h-[80vh] flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Interview Chat</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        {!joined ? (
          <div className="p-4 space-y-4">
            <Input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
            />
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Your Name"
            />
            <Button onClick={handleJoin} className="w-full">
              <LogIn className="w-4 h-4 mr-2" />
              Join
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start space-x-2 mb-4 ${
                    message.sender === username ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`rounded-lg p-2 max-w-[80%] ${
                      message.sender === username
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1">{message.sender}</p>
                    {message.message}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        )}
      </CardContent>
      {joined && (
        <CardFooter className="border-t p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardFooter>
      )}
      {connectionError && (
        <div className="bg-destructive/10 text-destructive p-2 text-sm">
          {connectionError}
        </div>
      )}
    </Card>
  )
}

