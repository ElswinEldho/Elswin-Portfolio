import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

# Ensure current directory is in sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from chat import VectorSearch, stream_answer, generate_answer

app = FastAPI(title="Portfolio Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

searcher = VectorSearch()
searcher.load_embeddings()


class ChatRequest(BaseModel):
    question: str
    stream: bool = False


@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    query = request.question.strip() if request.question else ""
    if not query:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    # 1. Pass question through existing vector retrieval logic
    results = searcher.search(query, top_k=5)

    # 2. If non-streaming requested (e.g. for testing in Swagger UI /docs)
    if not request.stream:
        answer = generate_answer(query, results)
        return {
            "question": query,
            "answer": answer
        }

    # 3. Return SSE StreamingResponse using existing Qwen generator
    return StreamingResponse(
        stream_answer(query, results),
        media_type="text/event-stream",
        headers={
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
