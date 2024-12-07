'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageSquare, LogIn, LogOut, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { io, Socket } from "socket.io-client"
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useParams } from 'next/navigation'
import axios from 'axios'
import AgoraRTC from 'agora-rtc-react'

interface Message {
    id: string
    sender: string
    message: string
}

interface ChatCardProps {
    channel: string;
    uid: string;
    currentQuestion: { question: string } | null;
}

export default function ChatCard({ channel, uid, currentQuestion }: ChatCardProps) {

    const [socket, setSocket] = useState<Socket | null>(null)
    const [roomId, setRoomId] = useState(channel)
    const [username, setUsername] = useState(uid)
    const [joined, setJoined] = useState(true)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputMessage, setInputMessage] = useState("")
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const [inputQuestion, setInputQuestion] = useState(null)

    const[panelMembers,setPanelMembers] = useState([])
    const {roomIdAgora,interviewId} = useParams()

   



     
const getPanelMembers = async ()=>{
    try{
        const response = await axios.get(`http://localhost:5454/api/v1/interview/interviews/${interviewId}`);

        setPanelMembers(response?.data?.data?.interviewers)


    }
    catch(error){
        console.log(error)
    }
}

useEffect(()=>{
  getPanelMembers();
})

    const connectSocket = useCallback(() => {
        if (roomId.trim() && username.trim()) {
            const newSocket = io("http://localhost:5454", {
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

    useEffect(() => {
        if (currentQuestion) setInputQuestion(currentQuestion);

    }, [currentQuestion])

    useEffect(() => {
        sendQuestion()
    }, [inputQuestion])

    useEffect(() => {
        handleJoin()
    }, [])


    const sendQuestion = () => {
        if (inputQuestion?.question && socket) {
            const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            const messageData = {
                id: messageId,
                roomId,
                message: inputQuestion?.question,
                sender: username
            }


            socket.emit("sendMessage", messageData)

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    id: messageId,
                    sender: username,
                    message: inputQuestion?.question
                }
            ])

            setInputQuestion(null)


        }
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
        <Card className="h-[95vh] flex flex-col bg-gradient-to-b from-background to-secondary/20">
            <CardHeader className="border-b">
                <CardTitle className="flex ">
                    <div className="flex w-full justify-between">
                        <div className='flex gap-2 '>
                            <MessageSquare className="w-5 h-5" />
                            <span>Interview Chat</span>
                        </div>

                        <div className='text-sm flex items-center justify-center bg-red-500 text-white px-2 rounded-lg '> ● Live</div>

                    </div>
                </CardTitle>
            </CardHeader>
            <Card className="mx-4 mt-4 bg-primary/5">
                <CardHeader className="py-2">
                    <CardTitle className="text-sm flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Panel Members
                    </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                    <div className="flex  flex-col gap-2 ">
                        {panelMembers?.map((member) => (
                            <div key={member.interviewer.id} className=" ">
                                <div className="text-xs text-center justify-between flex gap-4">
                                    <div className="font-sm">{member.interviewer.name}</div>
                                    <div className="font-sm text-muted-foreground ">{member.interviewer.email}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <CardContent className="flex-grow overflow-hidden p-0">
                {!joined ? (
                    <div className="p-4 space-y-4">
                        <div className="text-sm">Joining the interview...</div>
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
                                    className={`flex items-start space-x-2 mb-4 ${message.sender === username ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    <div
                                        className={`rounded-lg p-1.5 max-w-[80%] ${message.sender === username
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-secondary text-secondary-foreground'
                                            }`}
                                    >
                                        <p className="text-xs font-semibold mb-1" style={{ color: message.sender === username ? 'hsl(var(--primary-foreground))' : 'hsl(var(--secondary-foreground))' }}>
                                            {message.sender}
                                        </p>
                                        <p className="text-xs">{message.message}</p>
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
                            className="flex-grow text-sm"
                        />
                        <Button type="submit" size="icon" className="shrink-0">
                            <Send className="h-2 w-2" />
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

