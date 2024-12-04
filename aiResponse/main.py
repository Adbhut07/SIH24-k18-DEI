from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
from dotenv import load_dotenv
import os
import json
import traceback

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
YOUR_APP_NAME = "Interview Evaluation App"

async def evaluate_answer(question: str, answer: str, role: str):
    """
    Evaluate the candidate's answer using OpenRouter AI
    
    Args:
        question (str): The interview question
        answer (str): The candidate's answer
        role (str): The job role the candidate is applying for
    
    Returns:
        dict: Evaluation results including marks and relevancy score
    """
    try:
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "http://localhost:3000", 
            "X-Title": YOUR_APP_NAME,
        }
        
        prompt = f"""Evaluate the following interview scenario:

Question: {question}
Answer: {answer}
Job Role: {role}

Evaluation Criteria:
1. Technical Accuracy: Assess the depth and correctness of the answer
2. Role Relevance: Evaluate how well the answer matches the specific job role
3. Communication Skills: Consider clarity, structure, and articulation

Please provide a detailed evaluation with:
- Marks (out of 10): Rate technical accuracy and quality
- Relevancy Score (out of 10): Alignment with job role
- Brief Justification: Explain the scoring

Respond in a strict JSON format:
{{
    "marks": <technical_score>,
    "relevancyScore": <role_relevance_score>,
    "justification": "<explanation_of_scores>"
}}
"""
        
        body = {
            "model": "meta-llama/llama-3.2-3b-instruct:free",
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"}
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json=body,
                headers=headers,
            )
            
           
            if response.status_code != 200:
                return {
                    "error": "API call failed",
                    "status_code": response.status_code,
                    "response_text": response.text
                }
            
            result = response.json()
            
            try:
                content = result['choices'][0]['message']['content']
                parsed_result = json.loads(content)
                return parsed_result
            except (KeyError, json.JSONDecodeError) as parse_error:
                return {
                    "error": "Failed to parse API response",
                    "details": str(parse_error),
                    "raw_response": result
                }
    
    except Exception as e:
        return {
            "error": "Evaluation process failed",
            "exception": str(e),
            "traceback": traceback.format_exc()
        }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time interview answer evaluation
    
    Handles:
    - WebSocket connection
    - Receiving evaluation requests
    - Sending back evaluation results
    """
    await websocket.accept()
    
    try:
        while True:
            # Receive JSON data from the client
            data = await websocket.receive_json()
            
            # Validate input
            question = data.get("question")
            answer = data.get("answer")
            role = data.get("role")
            
            # Check for missing required fields
            if not all([question, answer, role]):
                await websocket.send_json({
                    "error": "Missing required fields",
                    "details": "Please provide question, answer, and role"
                })
                continue
            
            # Evaluate the answer
            try:
                result = await evaluate_answer(question, answer, role)
                await websocket.send_json(result)
            
            except Exception as e:
                # Handle any unexpected errors during evaluation
                error_response = {
                    "error": "Evaluation failed",
                    "details": str(e)
                }
                await websocket.send_json(error_response)
    
    except WebSocketDisconnect:
        print("WebSocket client disconnected")
    except Exception as e:
        # Log and handle any unexpected errors
        print(f"Unexpected WebSocket error: {e}")
        # Optional: you could implement reconnection logic here

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Simple health check endpoint to verify server is running
    """
    return {"status": "healthy", "message": "Interview Evaluation Service is up and running"}

# Error handler for unexpected routes
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found", 
            "message": "The requested endpoint does not exist"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True
    )