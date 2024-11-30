'use client';

import React, { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const GroupChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<{ 
    id: string; 
    sender: string; 
    message: string 
  }[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connectSocket = useCallback(() => {
    if (roomId.trim() && username.trim()) {
      const newSocket = io("http://localhost:5454", {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      newSocket.on("connect", () => {
        console.log(`Connected to server. Socket ID: ${newSocket.id}`);
        newSocket.emit("joinRoom", roomId);
        setJoined(true);
        setSocket(newSocket);
        setConnectionError(null);
      });

      newSocket.on("receiveMessage", (data: { 
        id: string; 
        sender: string; 
        message: string 
      }) => {
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(msg => msg.id === data.id);
          
          if (!messageExists) {
            return [...prevMessages, data];
          }
          
          return prevMessages;
        });
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        setConnectionError(`Connection failed: ${error.message}`);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Disconnected:", reason);
        setConnectionError(`Disconnected: ${reason}`);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [roomId, username]);

  useEffect(() => {
    if (joined && roomId && username) {
      const cleanup = connectSocket();
      return () => {
        cleanup && cleanup();
      };
    }
  }, [joined, roomId, username, connectSocket]);

  const handleJoin = () => {
    if (roomId.trim() && username.trim()) {
      connectSocket();
    }
  };

  const handleLeave = () => {
    if (socket) {
      socket.emit("leaveRoom", roomId);
      socket.disconnect();
    }
    
    setSocket(null);
    setJoined(false);
    setMessages([]);
    setRoomId("");
    setUsername("");
    setConnectionError(null);
  };

  const sendMessage = () => {
    if (inputMessage.trim() && socket) {
      const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const messageData = { 
        id: messageId,
        roomId, 
        message: inputMessage, 
        sender: username 
      };
      
      console.log("Sending message:", messageData);
      
      socket.emit("sendMessage", messageData);
      
      setMessages((prevMessages) => [
        ...prevMessages, 
        { 
          id: messageId,
          sender: username, 
          message: inputMessage 
        }
      ]);
      
      setInputMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg">
      {connectionError && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {connectionError}
        </div>
      )}

      {!joined ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Join Group Chat</h2>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Your Name"
            className="w-full p-2 border rounded"
          />
          <button 
            onClick={handleJoin} 
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Join
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Group Chat Room: {roomId}</h2>
          <button 
            onClick={handleLeave} 
            className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Leave Room
          </button>
          
          <div className="chat-box h-64 overflow-y-auto border p-2 bg-white">
            {messages.map((msg, index) => (
              <div 
                key={msg.id} 
                className={`mb-2 p-2 rounded ${
                  msg.sender === username 
                    ? 'bg-blue-100 text-right' 
                    : 'bg-gray-100'
                }`}
              >
                <strong>{msg.sender}:</strong> {msg.message}
              </div>
            ))}
          </div>
          
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-l"
              onKeyPress={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button 
              onClick={sendMessage} 
              className="bg-green-500 text-white p-2 rounded-r hover:bg-green-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;