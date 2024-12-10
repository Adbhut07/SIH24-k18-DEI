import { useState, useEffect, useRef, useCallback } from "react";

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

export default function useWebSocket() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      setIsConnected(true);
      setConnectionError(null);
      console.log("WebSocket connected");
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      console.log("WebSocket disconnected", event);
      if (!event.wasClean) {
        setConnectionError(`Connection lost: ${event.reason || "Unknown reason"}`);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error", error);
      setConnectionError("WebSocket connection failed");
      setIsConnected(false);
    };

    websocketRef.current = ws;
  }, []);

  // Send data and get response as a Promise
  const getEvaluatedDataFromAI = useCallback(
    (data: object): Promise<WebSocketResponse> => {
      return new Promise((resolve, reject) => {
        const ws = websocketRef.current;

        if (!ws || ws.readyState !== WebSocket.OPEN) {
          reject(new Error("WebSocket is not connected"));
          return;
        }

        ws.onmessage = (event) => {
          try {
            const response: WebSocketResponse = JSON.parse(event.data);
            resolve(response);
          } catch (error) {
            reject(new Error("Failed to parse server response"));
          }
        };

        try {
          ws.send(JSON.stringify(data));
        } catch (error) {
          reject(new Error("Failed to send message"));
        }
      });
    },
    []
  );

  // Close WebSocket on cleanup
  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  return { initializeWebSocket, getEvaluatedDataFromAI, isConnected, connectionError };
}
