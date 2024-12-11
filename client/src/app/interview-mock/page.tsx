'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import Papa from 'papaparse';


// TypeScript interfaces for type safety
interface WebSocketMessage {
  question: string;
  topics: string;
}

interface WebSocketResponse {
  relevance?: string;
  ideal_answer?: string;
  topic?: string;
  category?: string;
  feedback?: string;
  marks?: number;
  justification?: string;
  toughness?: string;
  relevancy_of_question?: string;
  error?: string;
}

export default function TestPage() {
  // State hooks for managing component state
  const [question, setQuestion] = useState<string>("");
  const [topics, setTopics] = useState<string>("");
  const [response, setResponse] = useState("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Ref to store WebSocket instance
  const websocketRef = useRef<WebSocket | null>(null);

  // Establish WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    const ws = new WebSocket("ws://localhost:8000/ws-evaluate");

    ws.onopen = () => {
      setIsConnected(true);
      setConnectionError(null);
      console.log("WebSocket connected");
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = event.data;
        console.log(data)

        let parsed = String(data).split("|");

// Ensure each field is cleaned to remove stray quotes or whitespace
parsed = parsed.map((field) => field.trim().replace(/^"|"$/g, ""));

if (parsed.length === 7) {
    const [relevance, idealAnswer, topic, category, feedback, toughness, suggestions] = parsed;

    const formattedData = {
        relevance,
        idealAnswer,
        topic,
        category,
        feedback,
        toughness,
        suggestions
    };

    console.log(formattedData);
} else {
    console.error("Parsing failed. Ensure the response format matches the expected structure.");
}
        
        setResponse(parsed.join(", "));
        
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        setResponse({ error: "Failed to parse server response" });
      }
    };

    ws.onclose = (event: CloseEvent) => {
      setIsConnected(false);
      console.log("WebSocket disconnected", event);
      if (!event.wasClean) {
        setConnectionError(`Connection lost: ${event.reason || 'Unknown reason'}`);
      }
    };

    ws.onerror = (error: Event) => {
      console.error("WebSocket error", error);
      setConnectionError("WebSocket connection failed");
      setIsConnected(false);
    };

    websocketRef.current = ws;
  }, []);

  // Send message to WebSocket server
  const sendMessage = useCallback(() => {
    const ws = websocketRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setConnectionError("WebSocket is not connected");
      return;
    }

    if (!question.trim() || !topics.trim()) {
      setConnectionError("Please fill in all fields");
      return;
    }

    const payload: WebSocketMessage = {
      question:question,
      topics: topics,
    };

    try {
      ws.send(JSON.stringify(payload));
      console.log(payload)
      setConnectionError(null);
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
      setConnectionError("Failed to send message");
    }
  }, [question, topics]);

  // Cleanup WebSocket on component unmount
  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Interview Answer Evaluation</h1>

      {/* Connection Status */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
        <button
          onClick={connectWebSocket}
          disabled={isConnected}
          style={{
            backgroundColor: isConnected ? "green" : "#0070f3",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: isConnected ? "default" : "pointer",
          }}
        >
          {isConnected ? "Connected" : "Connect WebSocket"}
        </button>

        {connectionError && (
          <div style={{ color: "red", marginLeft: "15px" }}>
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
            style={{ marginLeft: "10px", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          <strong>Candidate Skills:</strong>
          <input
            type="text"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="Enter topics"
            style={{ marginLeft: "10px", width: "100%", padding: "8px" }}
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
          cursor: isConnected ? "pointer" : "default",
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
            border: "1px solid #ddd",
          }}
        >
          {response ? JSON.stringify(response, null, 2) : "No evaluation result yet"}
        </pre>
      </div>
    </div>
  );
}
