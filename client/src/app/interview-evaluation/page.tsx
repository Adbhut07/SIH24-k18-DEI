'use client';

import { useState, useEffect, useCallback, useRef } from "react";

// TypeScript interfaces for type safety
interface WebSocketMessage {
  question: string;
  answer: string;
  role: string;
}

interface WebSocketResponse {
  marks?: number;
  relevancyScore?: number;
  justification?: string;
  error?: string;
}

export default function TestPage() {
  // State hooks for managing component state
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [response, setResponse] = useState<WebSocketResponse | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Ref to store WebSocket instance
  const websocketRef = useRef<WebSocket | null>(null);

  // Establish WebSocket connection
  const connectWebSocket = useCallback(() => {
    // Close existing connection if one exists
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    // Create new WebSocket connection
    const ws = new WebSocket("ws://localhost:8000/ws");

    // Connection opened
    ws.onopen = () => {
      setIsConnected(true);
      setConnectionError(null);
      console.log("WebSocket connected");
    };

    // Receive message from server
    ws.onmessage = (event: MessageEvent) => {
      try {
        const data: WebSocketResponse = JSON.parse(event.data);
        setResponse(data);
        console.log("Received response:", data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        setResponse({
          error: "Failed to parse server response"
        });
      }
    };

    // Connection closed
    ws.onclose = (event: CloseEvent) => {
      setIsConnected(false);
      console.log("WebSocket disconnected", event);
      
      // Provide more detailed disconnection reason
      if (!event.wasClean) {
        setConnectionError(`Connection lost: ${event.reason || 'Unknown reason'}`);
      }
    };

    // Connection error
    ws.onerror = (error: Event) => {
      console.error("WebSocket error", error);
      setConnectionError("WebSocket connection failed");
      setIsConnected(false);
    };

    // Store WebSocket instance in ref
    websocketRef.current = ws;
  }, []);

  // Send message to WebSocket server
  const sendMessage = useCallback(() => {
    const ws = websocketRef.current;

    // Validate WebSocket connection
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setConnectionError("WebSocket is not connected");
      return;
    }

    // Validate input fields
    if (!question.trim() || !answer.trim() || !role.trim()) {
      setConnectionError("Please fill in all fields");
      return;
    }

    // Prepare payload
    const payload: WebSocketMessage = {
      question,
      answer,
      role
    };

    try {
      // Send message
      ws.send(JSON.stringify(payload));
      setConnectionError(null);
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
      setConnectionError("Failed to send message");
    }
  }, [question, answer, role]);

  // Cleanup WebSocket on component unmount
  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  return (
    <div style={{ 
      padding: "20px", 
      fontFamily: "Arial", 
      maxWidth: "800px", 
      margin: "0 auto" 
    }}>
      <h1>Interview Answer Evaluation</h1>

      {/* Connection Status */}
      <div style={{ 
        marginBottom: "20px", 
        display: "flex", 
        alignItems: "center" 
      }}>
        <button 
          onClick={connectWebSocket} 
          disabled={isConnected}
          style={{
            backgroundColor: isConnected ? "green" : "#0070f3",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: isConnected ? "default" : "pointer"
          }}
        >
          {isConnected ? "Connected" : "Connect WebSocket"}
        </button>
        
        {connectionError && (
          <div style={{ 
            color: "red", 
            marginLeft: "15px" 
          }}>
            {connectionError}
          </div>
        )}
      </div>

      {/* Input Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <label>
          <strong>Question:</strong>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter interview question"
            style={{ 
              marginLeft: "10px", 
              width: "100%", 
              padding: "8px" 
            }}
          />
        </label>

        <label>
          <strong>Answer:</strong>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter candidate's answer"
            style={{ 
              marginLeft: "10px", 
              width: "100%", 
              minHeight: "100px", 
              padding: "8px" 
            }}
          />
        </label>

        <label>
          <strong>Job Role:</strong>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Enter job role (e.g., Software Engineer, Data Scientist)"
            style={{ 
              marginLeft: "10px", 
              width: "100%", 
              padding: "8px" 
            }}
          />
        </label>
      </div>

      {/* Send Button */}
      <button
        onClick={sendMessage}
        disabled={!isConnected}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: isConnected ? "#0070f3" : "gray",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: isConnected ? "pointer" : "default"
        }}
      >
        Send for Evaluation
      </button>

      {/* Response Display */}
      <div style={{ marginTop: "20px" }}>
        <h3>Evaluation Result:</h3>
        <pre
          style={{
            background: "#f4f4f4",
            padding: "15px",
            borderRadius: "5px",
            maxWidth: "100%",
            overflowX: "auto",
            minHeight: "100px",
            border: "1px solid #ddd"
          }}
        >
          {response
            ? JSON.stringify(response, null, 2)
            : "No evaluation result yet"}
        </pre>
      </div>
    </div>
  );
}