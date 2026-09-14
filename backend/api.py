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


@app.get("/")
@app.get("/healthz")
async def health_check():
    import os
    groq_key = os.environ.get("GROQ_API_KEY", "")
    return {
        "status": "ok",
        "message": "Portfolio API is running",
        "groq_configured": bool(groq_key),
        "groq_key_preview": f"{groq_key[:8]}..." if groq_key else "NOT SET"
    }


@app.get("/debug/env")
async def debug_env():
    import os
    groq_key = os.environ.get("GROQ_API_KEY", "")
    gemini_key = os.environ.get("GEMINI_API_KEY", "")
    openai_key = os.environ.get("OPENAI_API_KEY", "")
    return {
        "GROQ_API_KEY": f"{groq_key[:12]}..." if groq_key else "NOT SET",
        "GEMINI_API_KEY": f"{gemini_key[:8]}..." if gemini_key else "NOT SET",
        "OPENAI_API_KEY": f"{openai_key[:8]}..." if openai_key else "NOT SET",
        "llm_backend": "groq" if groq_key else ("gemini" if gemini_key else ("openai" if openai_key else "rag-fallback"))
    }


@app.get("/debug/llm-test")
async def llm_test():
    """Tests Gemini (primary) then Groq (secondary) to confirm which LLM works from Render."""
    import os, urllib.request, json, urllib.error
    results = {}

    # Test Gemini
    gemini_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if gemini_key:
        models_to_try = ["gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash-latest"]
        gemini_result = {"status": "error", "detail": "all models failed"}
        for model in models_to_try:
            api_url = (
                f"https://generativelanguage.googleapis.com/v1beta/models/"
                f"{model}:generateContent?key={gemini_key}"
            )
            payload = {
                "contents": [{"role": "user", "parts": [{"text": "Say: Gemini is working!"}]}],
                "generationConfig": {"maxOutputTokens": 20}
            }
            req = urllib.request.Request(api_url, json.dumps(payload).encode(),
                                         {"Content-Type": "application/json"})
            try:
                with urllib.request.urlopen(req, timeout=20) as resp:
                    data = json.loads(resp.read().decode())
                    text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                    gemini_result = {"status": "success", "model": model, "response": text}
                    break
            except urllib.error.HTTPError as e:
                gemini_result = {"status": "error", "model_tried": model, "code": e.code, "detail": e.read().decode()[:80]}
            except Exception as e:
                gemini_result = {"status": "error", "model_tried": model, "detail": str(e)}
        results["gemini"] = gemini_result
    else:
        results["gemini"] = {"status": "not_configured"}

    # Test Groq
    groq_key = os.environ.get("GROQ_API_KEY", "").strip()
    if groq_key:
        payload = {"model": "llama-3.3-70b-versatile",
                   "messages": [{"role": "user", "content": "Say: Groq is working!"}],
                   "stream": False, "max_tokens": 20}
        req = urllib.request.Request("https://api.groq.com/openai/v1/chat/completions",
                                     json.dumps(payload).encode(),
                                     {"Content-Type": "application/json",
                                      "Authorization": f"Bearer {groq_key}"})
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode())
                text = data["choices"][0]["message"]["content"].strip()
                results["groq"] = {"status": "success", "response": text}
        except urllib.error.HTTPError as e:
            results["groq"] = {"status": "error", "code": e.code, "detail": e.read().decode()[:100]}
        except Exception as e:
            results["groq"] = {"status": "error", "detail": str(e)}
    else:
        results["groq"] = {"status": "not_configured"}

    active = "gemini" if results.get("gemini", {}).get("status") == "success" else \
             "groq" if results.get("groq", {}).get("status") == "success" else "none"
    return {"active_llm": active, "details": results}


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
