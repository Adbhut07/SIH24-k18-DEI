import os
import json
import traceback
import json
import httpx
import fitz  
import logging
import numpy as np
# from ultralytics import YOLO
import base64
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image

# Load environment variables
load_dotenv()

# model = YOLO('yolov8n.pt')

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
YOUR_APP_NAME = "Interview Evaluation App"

# Check if API key is set
if not OPENROUTER_API_KEY:
    raise ValueError("OPENROUTER_API_KEY environment variable is not set")


# Utility function to extract skills
async def extract_skills(text: str):
    """Extract skills from the given text using OpenRouter AI."""
    try:
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": YOUR_APP_NAME,
        }

        prompt = f"""
        Extract all relevant skills from the following resume text.
        Focus on both technical and soft skills, including any certifications or tools mentioned.
        Just give the names in comma-separated format. No other text.

        Resume Text: {text}
        """

        body = {
            "model": "meta-llama/llama-3.2-3b-instruct:free",
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "string"},
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json=body,
                headers=headers,
            )

            response.raise_for_status()  # Raise exception for HTTP errors
            result = response.json()
            return result["choices"][0]["message"]["content"]

    except Exception as e:
        logger.error(f"Skill extraction failed: {e}")
        return {
            "error": "Skill extraction process failed",
            "exception": str(e),
            "traceback": traceback.format_exc(),
        }


# Endpoint to upload a resume and extract skills
@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload a PDF resume, extract text, and identify skills."""
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")

    try:
        # Save the uploaded PDF to a temporary file
        contents = await file.read()
        temp_pdf_path = f"temp_{file.filename}"
        with open(temp_pdf_path, "wb") as temp_file:
            temp_file.write(contents)

        # Extract text from the PDF using PyMuPDF
        with fitz.open(temp_pdf_path) as pdf_doc:
            pdf_text = "".join(page.get_text() for page in pdf_doc)

        # Clean up the temporary file
        os.remove(temp_pdf_path)

        # Extract skills from the text
        result = await extract_skills(pdf_text)
        return result

    except Exception as e:
        logger.error(f"Failed to process the uploaded PDF: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "error": "Failed to process the uploaded PDF",
                "details": str(e),
                "traceback": traceback.format_exc(),
            },
        )


# Utility function to evaluate answers
async def evaluate_answer(question: str, candidate_skills: str, candidate_ans: str):
    """Evaluate the candidate's answer using OpenRouter AI."""
    try:
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": YOUR_APP_NAME,
        }

        prompt = f"""
        Evaluate the following interview scenario:

        Question: {question}
        Candidate Skills: {candidate_skills}
        Candidate's Answer: {candidate_ans}

        Evaluation Criteria:
        1. **Relevance**: Assess how well question relates to the candidate's listed skills (out of 10).
        2. **Ideal Answer**: Provide the ideal answer for this question.
        3. **Topic**: Identify the topic the question belongs to.
        4. **Category**: Classify the question into a specific category (e.g., technical, behavioral, etc.).
        5. **Feedback**: Give constructive feedback for improvement.
        6. **Marks (out of 10)**: Rate the candidate answer based on technical accuracy, clarity, and relevance. Give 0 marks if not answered.
        7. **Toughness**: Rate the question's difficulty level (out of 10).

        Provide the response strictly in the following JSON format:
        {{
            "relevance": "<relevancy of the question to candidate skills in number (out of 10)>",
            "ideal_ans": "<ideal answer>",
            "topic": "<topic>",
            "category": "<category>",
            "feedback_ai": "<constructive feedback>",
            "marks": <score_out_of_10>,
            "toughness": "<difficulty level out of 10>"
        }}
        """

        body = {
            "model": "meta-llama/llama-3.2-3b-instruct:free",
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"},
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json=body,
                headers=headers,
            )

            response.raise_for_status()
            result = response.json()

            content = result["choices"][0]["message"]["content"]
            return json.loads(content)

    except Exception as e:
        logger.error(f"Evaluation process failed: {e}")
        return {
            "error": "Evaluation process failed",
            "exception": str(e),
            "traceback": traceback.format_exc(),
        }


async def evaluate_relevance(question: str, topics: str, role: str):
    """Evaluate the relevance of the question against the topics and role."""
    try:
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": YOUR_APP_NAME,
        }

        prompt = f"""
Assess the relevance of the following interview question in the context of the provided topics and role:

Question: {question}
Topics: {topics}
Role: {role}

Provide a JSON response with:
- relevance_score: An integer between 1 and 10
- explanation: A brief explanation of the question's relevance

Strictly follow this JSON format:
{{
  "relevance_score": 7,
  "explanation": "The question is highly relevant to Backend Development as it discusses core concepts such as API design and microservices architecture."
}}
"""

        body = {
            "model": "meta-llama/llama-3.2-3b-instruct:free",
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"},
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json=body,
                headers=headers,
            )
            response.raise_for_status()
            result = response.json()
            
            # Extract the content of the AI's response
            content = result["choices"][0]["message"]["content"]
            logger.info(f"Received content: {content}")

            # Robust JSON parsing
            try:
                # Remove any leading/trailing whitespace and potential code block formatting
                content = content.strip('`').strip()
                
                # Parse the JSON content
                parsed_content = json.loads(content)
                
                # Validate the parsed content
                if not isinstance(parsed_content, dict):
                    raise ValueError("Parsed content is not a dictionary")
                
                # Ensure required keys exist
                if "relevance_score" not in parsed_content or "explanation" not in parsed_content:
                    raise KeyError("Missing required JSON keys")
                
                return parsed_content

            except (json.JSONDecodeError, ValueError, KeyError) as parse_error:
                logger.error(f"JSON parsing error: {parse_error}")
                logger.error(f"Problematic content: {content}")
                return {
                    "error": "Failed to parse relevance result",
                    "raw_content": content,
                    "exception": str(parse_error)
                }

    except Exception as e:
        logger.error(f"Relevance evaluation failed: {e}")
        return {
            "error": "Relevance evaluation failed",
            "exception": str(e),
            "traceback": traceback.format_exc(),
        }

async def evaluate_question(question: str, topics: str, role: str):
    """Evaluate the candidate's answer using OpenRouter AI, separating relevance evaluation."""
    try:
        # First, evaluate relevance
        relevance_result = await evaluate_relevance(question, topics, role)
        
        # Check if relevance score is low or invalid
        if relevance_result.get("relevance_score", 0) <= 3:
            return f"Evaluation aborted: The question is irrelevant. {relevance_result}"

        # Proceed with full question evaluation if relevance is satisfactory
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": YOUR_APP_NAME,
        }

        prompt = f"""
Evaluate the following interview scenario:

Question: {question}
Topics: {topics}
Role: {role}

Instructions:
1. Evaluate the question's relevance against the provided topics and the role, considering the relevance score.
2. If relevance is high, evaluate the ideal answer, related topics, category, and feedback.
3. If the question is irrelevant, provide constructive feedback and suggest focusing on relevant areas.

Format the response like this:
{
  "ideal_answer": "The ideal answer to the question.",
  "category": "The category of the answer (e.g., Technical, HR, etc.)",
  "feedback": "Constructive feedback for the candidate's answer.",
  "toughness": "A subjective score indicating the question's toughness (1-10).",
  "suggestion": "Suggestions for further improvement."
}

Example:
{
  "ideal_answer": "An API (Application Programming Interface) is a set of defined rules that enables different software systems to communicate with each other, allowing data exchange and integration.",
  "category": "Technical",
  "feedback": "The answer should cover key API concepts and their application in microservices.",
  "toughness": 7,
  "suggestion": "Consider adding examples of API use in real-world backend systems."
}
"""

        body = {
            "model": "meta-llama/llama-3.2-3b-instruct:free",
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"},
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json=body,
                headers=headers,
            )
            response.raise_for_status()
            result = response.json()
            
            content = result["choices"][0]["message"]["content"]
            print("OpenRouter response:", content)

            # Parse the JSON result
            try:
                parsed_content = eval(content)  # Be careful with eval, it's used here for example purposes
                return parsed_content
            except Exception as e:
                logger.error(f"Failed to parse question evaluation result: {e}")
                return {"error": "Failed to parse question evaluation result", "exception": str(e)}

    except Exception as e:
        logger.error(f"Evaluation process failed: {e}")
        return {
            "error": "Evaluation process failed",
            "exception": str(e),
            "traceback": traceback.format_exc(),
        }
# WebSocket endpoint for real-time evaluation
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time interview answer evaluation."""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            question = data.get("question")
            candidate_skills = data.get("candidate_skills")
            candidate_ans = data.get("candidate_ans")

            if not all([question, candidate_skills, candidate_ans]):
                await websocket.send_json({"error": "Missing required fields"})
                continue

            result = await evaluate_answer(question, candidate_skills, candidate_ans)
            await websocket.send_json(result)

    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"Unexpected WebSocket error: {e}")
        await websocket.close()


@app.websocket("/ws-evaluate")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            question = data.get("question")
            topics = data.get("topics")
            role = data.get("role")

            print(f"Received data: question={question}, topics={topics}, role={role}")

            if not all([question, topics, role]):
                await websocket.send_json({"error": "Missing required fields"})
                continue

            result = await evaluate_relevance(question, topics, role)
            print(f"Evaluation result: {result}")
            await websocket.send_json(result)

    except Exception as e:
        logger.error(f"WebSocket error: {e}", exc_info=True)
        await websocket.close()


@app.websocket("/detect-mobile")
async def mobile_detection_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time mobile phone detection 
    using object detection
    """
    await websocket.accept()
    logger.info("WebSocket connection established")
    try:
        while True:
            # Receive base64 encoded image from frontend
            data = await websocket.receive_json()
            
            # Extract base64 image 
            if 'image' not in data:
                await websocket.send_json({
                    "error": "No image received", 
                    "mobile_detected": False
                })
                continue

            # Decode base64 image
            try:
                image_data = base64.b64decode(data['image'].split(',')[1])
                image = Image.open(io.BytesIO(image_data))
                
                # Convert PIL Image to numpy array
                frame = np.array(image)
                
                # Perform object detection
                results = model(frame)
                
                # Check for mobile phones (class 67 in COCO dataset)
                mobile_phones = [
                    det for det in results[0].boxes.data 
                    if int(det[5]) == 67 and float(det[4]) > 0.5  # Confidence threshold
                ]
                
                # Prepare response
                response = {
                    "mobile_detected": len(mobile_phones) > 0,
                    "mobile_count": len(mobile_phones),
                    "details": [
                        {
                            "confidence": float(phone[4]),
                            "bbox": [float(x) for x in phone[:4]]
                        } for phone in mobile_phones
                    ]
                }
                
                await websocket.send_json(response)

            except WebSocketDisconnect:
                logger.info("WebSocket client disconnected")
                break
            except Exception as e:
                logger.error(f"WebSocket processing error: {e}")
                break
                
            except Exception as e:
                await websocket.send_json({
                    "error": str(e),
                    "mobile_detected": False
                })

    except WebSocketDisconnect:
        logger.info("Mobile detection WebSocket client disconnected")
    except Exception as e:
        logger.error(f"Unexpected mobile detection error: {e}")
        await websocket.close()

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "message": "Interview Evaluation Service is up and running"}


# Error handler for unexpected routes
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Not Found", "message": "The requested endpoint does not exist"},
    )


# Run the application
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
