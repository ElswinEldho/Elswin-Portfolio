import json
import logging
import math
import os
import re
import sys
import warnings

# Ensure UTF-8 output encoding for standard output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# ─────────────────────────────────────────────
# DEBUG FLAG
# Set to True to display retrieved chunks and
# similarity scores before the final answer.
# Set to False for clean production output.
# ─────────────────────────────────────────────
DEBUG = False


# Import model loader from generate_embeddings
try:
    from generate_embeddings import get_embedding_model
except ImportError:
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    from generate_embeddings import get_embedding_model


def cosine_similarity(vec_a, vec_b):
    """Calculates cosine similarity between two numeric vectors."""
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)


class VectorSearch:
    def __init__(self, embeddings_file=None, model_name="all-MiniLM-L6-v2"):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        if embeddings_file is None:
            cand1 = os.path.join(base_dir, "embeddings.json")
            cand2 = os.path.join(base_dir, "..", "embeddings.json")
            embeddings_file = cand1 if os.path.exists(cand1) else (cand2 if os.path.exists(cand2) else cand1)

        self.embeddings_file = embeddings_file
        self.model_name = model_name
        self.chunks = []
        self.model = None

    def load_embeddings(self):
        """Loads and validates embeddings.json file."""
        if not os.path.exists(self.embeddings_file):
            print(f"Error: Embeddings file '{self.embeddings_file}' not found.")
            print("Please run 'generate_embeddings.py' first to generate embeddings.")
            return False

        try:
            with open(self.embeddings_file, "r", encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error: Invalid or malformed JSON in '{self.embeddings_file}': {e}")
            return False
        except Exception as e:
            print(f"Error reading embeddings file '{self.embeddings_file}': {e}")
            return False

        if not isinstance(data, dict):
            print(f"Error: Expected JSON object in '{self.embeddings_file}'.")
            return False

        raw_chunks = data.get("embeddings") or data.get("chunks", [])
        if not raw_chunks:
            print(f"Warning: No embeddings found in '{self.embeddings_file}'.")
            return False

        self.chunks = []
        for idx, chunk in enumerate(raw_chunks):
            if not isinstance(chunk, dict):
                continue

            text = chunk.get("text")
            vector = chunk.get("vector")

            if not text or not isinstance(text, str) or not text.strip():
                continue
            if vector is None or not isinstance(vector, (list, tuple)):
                continue
            if not all(isinstance(v, (int, float)) for v in vector):
                continue

            self.chunks.append({
                "id": chunk.get("id", idx),
                "text": text.strip(),
                "vector": [float(v) for v in vector]
            })

        if not self.chunks:
            print(f"Error: No valid chunks available in '{self.embeddings_file}'.")
            return False

        return True

    def get_model(self):
        """Loads and returns the all-MiniLM model instance."""
        if self.model is None:
            self.model = get_embedding_model(self.model_name)
        return self.model

    def _tfidf_search(self, normalized_query, top_k=5, target_sections=None):
        """
        Pure-Python TF-IDF keyword search fallback.
        Used when SentenceTransformer cannot be loaded (e.g. DLL load blocked by Application Control policy).
        """
        import collections
        if target_sections is None:
            target_sections = []

        def tokenize(text):
            return re.findall(r'\w+', text.lower())

        query_tokens = tokenize(normalized_query)
        if not query_tokens:
            return [(0.0, chunk) for chunk in self.chunks[:top_k]]

        doc_count = len(self.chunks)
        if doc_count == 0:
            return []

        # Calculate Document Frequencies (DF)
        df = collections.Counter()
        doc_tokens_list = []
        for chunk in self.chunks:
            tokens = set(tokenize(chunk["text"]))
            doc_tokens_list.append(tokenize(chunk["text"]))
            for t in tokens:
                df[t] += 1

        # Calculate IDF values
        idf = {}
        for token, count in df.items():
            idf[token] = math.log((doc_count + 1) / (count + 0.5)) + 1.0

        # Score documents against query
        scored_chunks = []
        for idx, chunk in enumerate(self.chunks):
            doc_tokens = doc_tokens_list[idx]
            doc_tf = collections.Counter(doc_tokens)
            doc_len = max(len(doc_tokens), 1)

            score = 0.0
            for qt in query_tokens:
                if qt in doc_tf:
                    tf_val = doc_tf[qt] / doc_len
                    score += tf_val * idf.get(qt, 1.0)

            # Boost score if chunk text matches target section requested by user
            chunk_text_lower = chunk["text"].lower()
            for sec in target_sections:
                if chunk_text_lower.startswith(sec):
                    score += 0.5
                    break

            scored_chunks.append((score, chunk))

        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        return scored_chunks[:top_k]

    def search(self, query_text, top_k=5, min_similarity=0.25):
        """
        Embeds the question using all-MiniLM, computes cosine similarity
        against every stored chunk, and returns the top_k results.
        Falls back to pure-Python TF-IDF search if model loading fails.
        """
        if not query_text or not query_text.strip():
            print("Error: Question cannot be empty.")
            return []

        if not self.chunks:
            if not self.load_embeddings():
                return []

        # 1. Normalize common typos and variations in query
        normalized_query = query_text
        typo_rules = [
            (r'\bintership\b|\binterships\b|\bintern\b|\binternship\b|\binternships\b', 'internship'),
            (r'\bprojct\b|\bprojcts\b|\bproject\b|\bprojects\b', 'project'),
            (r'\bskil\b|\bskils\b|\bskill\b|\bskills\b', 'skill'),
            (r'\bedu\b|\beducation\b|\bstudies\b', 'education'),
            (r'\bcertif\b|\bcertification\b|\bcertifications\b', 'certification'),
            (r'\bexperiance\b|\bexperience\b|\brole\b|\broles\b', 'experience')
        ]
        for pattern, repl in typo_rules:
            if re.search(pattern, normalized_query, re.IGNORECASE):
                normalized_query = re.sub(pattern, repl, normalized_query, flags=re.IGNORECASE)

        # 2. Identify key target section keywords in query for section boosting
        query_lower = normalized_query.lower()
        target_sections = []
        if 'internship' in query_lower:
            target_sections.append('internships')
        if 'project' in query_lower:
            target_sections.append('projects')
        if 'education' in query_lower:
            target_sections.append('education')
        if 'certification' in query_lower:
            target_sections.append('certifications')

        model = None
        try:
            model = self.get_model()
        except Exception as e:
            print(f"Warning: SentenceTransformer unavailable ({e}). Falling back to pure-Python TF-IDF search.")

        if model is None:
            return self._tfidf_search(normalized_query, top_k=top_k, target_sections=target_sections)

        try:
            question_vector = model.encode([normalized_query], convert_to_numpy=True)[0].tolist()
            q_dim = len(question_vector)
        except Exception as e:
            print(f"Warning: Encoding failed ({e}). Falling back to pure-Python TF-IDF search.")
            return self._tfidf_search(normalized_query, top_k=top_k, target_sections=target_sections)

        scored_chunks = []
        for chunk in self.chunks:
            c_vector = chunk["vector"]
            if len(c_vector) != q_dim:
                continue
            score = cosine_similarity(question_vector, c_vector)
            
            # Boost score if chunk text matches the target section requested by user
            chunk_text_lower = chunk["text"].lower()
            for sec in target_sections:
                if chunk_text_lower.startswith(sec):
                    score += 0.25
                    break

            scored_chunks.append((score, chunk))

        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        filtered = [item for item in scored_chunks if item[0] >= min_similarity]
        if filtered:
            return filtered[:top_k]
        return scored_chunks[:top_k]


def _build_prompts(query, results):
    """Constructs system and user prompts using retrieved context and rules."""
    retrieved_chunks = "\n\n".join(
        f"[Chunk {idx}]\n{chunk['text']}"
        for idx, (_, chunk) in enumerate(results, start=1)
    )

    query_lower = query.lower()

    # Detect out-of-scope / personal / casual questions
    out_of_scope_triggers = [
        'girlfriend', 'boyfriend', 'marry', 'dating', 'single', 'crush', 'wife', 'husband',
        'kick', 'punch', 'hit', 'fight', 'shake', 'recipe', 'bake', 'cook', 'cake', 'chocolate',
        'love', 'capital of', 'weather', 'food', 'drink'
    ]
    third_party_names = ['prem', 'premkrishna', 'alen', 'vishnu', 'adithya']
    is_out_of_scope = any(t in query_lower for t in out_of_scope_triggers) or any(name in query_lower for name in third_party_names)

    system_rules = [
        "CRITICAL RULES:",
        "1. PORTFOLIO-FOCUSED TECH EXPLANATIONS:",
        "   - When asked 'what is [technology]' (e.g. 'what is python', 'what is django', 'what is ESP32'), DO NOT explain what the technology is in general.",
        "   - Answer strictly from Elswin's portfolio perspective: state that Python is one of Elswin's key programming languages listed in his technical skills, and explain how Elswin applies Python in his portfolio projects.",
        "2. DYNAMIC TECHNICAL RATING & EVALUATION:",
        "   - When asked to evaluate, score, or rate Elswin's technical knowledge or portfolio out of N, match the requested scale (e.g., X / 5, X / 10, X / 100) and justify using his credentials.",
        "3. ELSWIN'S CAREER TRAJECTORY & ESTIMATIONS (IN-SCOPE):",
        "   - Questions asking about 'him', 'Elswin', 'his future', 'where will he end up in 10 years', 'salary recommendations', or 'role suitability' ARE IN-SCOPE.",
        "   - Answer them directly and professionally regarding Elswin's growth (e.g. Senior Full-Stack Architect or AI/ML Tech Lead)."
    ]

    if is_out_of_scope:
        system_rules.append(
            "4. DYNAMIC OUT-OF-SCOPE ACKNOWLEDGMENT RULE:\n"
            "   - FOR ANY CASUAL, PERSONAL, RANDOM, OR UNRELATED QUESTION (e.g., about relationships, girlfriends, kicking someone, recipes, third-party people):\n"
            "   - YOU MUST ALWAYS BEGIN YOUR ANSWER WITH A SHORT, FUN 1-SENTENCE ACKNOWLEDGMENT reacting to the exact items/names in the question with humor and emojis!\n"
            "   - THEN immediately state: '...but let's get back to Elswin's portfolio!' and present Elswin's credentials.\n"
            "   - NEVER output steps, recipes, or tutorials for out-of-scope questions. ALWAYS acknowledge first!"
        )

    system_rules.extend([
        "5. FORMATTING RULES:",
        "   - FOR MULTIPLE DISTINCT ITEMS (e.g., listing projects, internships, work experiences, skills, certifications): YOU MUST format as a clean point-wise bulleted list (`- **Title**: Description`).",
        "   - FOR SINGLE QUESTIONS / CONCEPTS / RATINGS / CAREER PREDICTIONS: Provide a direct, cohesive answer in clear sentences describing Elswin's specific usage, skills, or career trajectory.",
        "6. NO META-PHRASES: ABSOLUTELY DO NOT start responses with meta-phrases like 'Based on the provided context', 'Based on the context', 'According to the context', or 'The text states'. Start directly with the answer.",
        "7. Keep tone professional, polite, and articulate."
    ])

    system_prompt = (
        "You are an AI assistant representing Elswin's professional portfolio and profile.\n"
        "Your task is to provide natural, professional, clear, and AI-friendly answers based strictly on the retrieved context.\n\n" +
        "\n".join(system_rules)
    )

    scale_match = re.search(r'out\s+of\s+(\d+)', query, re.IGNORECASE)
    if scale_match:
        target_scale = scale_match.group(1)
        system_prompt += (
            f"\n\nSTRICT SCALE OVERRIDE: The user explicitly requested the evaluation OUT OF {target_scale}.\n"
            f"You MUST calculate and state the final numerical score strictly out of {target_scale} (for example: **X / {target_scale}**).\n"
            f"DO NOT output / 10 if the user asked out of {target_scale}!"
        )

    if is_out_of_scope:
        user_prompt = (
            f"Question:\n{query}\n\n"
            f"Source Facts (Retrieved Context):\n{retrieved_chunks}\n\n"
            f"MANDATORY INSTRUCTION FOR OUT-OF-SCOPE / PERSONAL QUESTION:\n"
            f"1. Your VERY FIRST SENTENCE MUST be a short, light, fun, playful 1-sentence acknowledgment reacting to '{query.strip()}' with humor and emojis, followed by '...but let's get back to Elswin's portfolio!'.\n"
            f"2. Then present Elswin's portfolio facts.\n"
            f"DO NOT skip step 1! Start directly with the fun 1-sentence acknowledgment:\n"
            f"Answer:"
        )
    else:
        user_prompt = (
            f"Question:\n{query}\n\n"
            f"Source Facts (Retrieved Context):\n{retrieved_chunks}\n\n"
            f"Answer:"
        )

    return system_prompt, user_prompt


def _fallback_smart_answer(query, results):
    """
    Intelligently parses retrieved chunks and synthesizes natural, clean,
    and polished responses tailored to the user's specific question intent
    when running on cloud hosts without Ollama.
    """
    if not results:
        return "This information is not available in Elswin's profile."

    query_lower = query.lower()
    raw_texts = [chunk["text"].strip() for _, chunk in results if chunk.get("text")]

    # 1. Salary / Evaluation / Compensation Intent
    if any(k in query_lower for k in ['salary', 'compensation', 'package', 'lpa', 'pay', 'remuneration', 'worth', 'offer']):
        return (
            "Based on Elswin's technical credentials, 1 year of hands-on experience as a Junior Developer, "
            "and current market standards in Kochi (for a mid-sized IT company of ~200 employees):\n\n"
            "- **Recommended Salary Range**: **₹5.0 LPA – ₹7.5 LPA**\n"
            "- **Role Suitability**: Junior Full-Stack Developer / Software Engineer / AI Solution Developer\n"
            "- **Key Justification**:\n"
            "  • Production expertise in React, Next.js, TypeScript, Node.js, Python, and PostgreSQL/MongoDB\n"
            "  • Hands-on experience building enterprise ESG platforms, carbon accounting modules, and REST APIs\n"
            "  • Proven record developing ML systems (98% accuracy Random Forest speech disorder model & Explainable AI with SHAP/LIME)"
        )

    # 2. Technology / Skills Intent
    if any(k in query_lower for k in ['technology', 'technologies', 'tech stack', 'skill', 'skills', 'tools', 'languages']):
        return (
            "Elswin utilizes a modern full-stack and AI/ML tech stack across his projects and professional roles:\n\n"
            "- **Programming Languages**: Python, JavaScript, TypeScript\n"
            "- **Frontend Development**: React, Next.js, Vite, Tailwind CSS, Recharts\n"
            "- **Backend & APIs**: Node.js, Express, Django, FastAPI, REST APIs\n"
            "- **Databases & Cloud**: PostgreSQL, MongoDB, Mongoose, Firebase\n"
            "- **AI, ML & Data Analytics**: Machine Learning (Random Forest, Scikit-learn), Librosa (Audio Processing), Explainable AI (SHAP, LIME), Power BI, ESG Analytics\n"
            "- **Tools & Workflow**: VS Code, Git, GitHub, Docker, BitBucket, Jira, MS Excel"
        )

    # 3. Machine Learning / AI Projects Intent
    if any(k in query_lower for k in ['ml', 'machine learning', 'ai project', 'ai-driven', 'models']):
        return (
            "Elswin has engineered several innovative AI & Machine Learning solutions:\n\n"
            "- **AI-Powered Speech Analysis Tool for Speech Therapists**:\n"
            "  A Django web application that assists in diagnosing speech disorders (e.g., dysarthria) with **98% classification accuracy** using Librosa for MFCC feature extraction and Scikit-learn (Random Forest). Presented at ICIMRBE 2025.\n\n"
            "- **AI-Driven Smart Agriculture & Soil Intelligence Platform**:\n"
            "  An IoT-enabled (ESP32) smart farming system built with FastAPI and ML models to provide real-time crop & fertilizer recommendations with Explainable AI (SHAP & LIME) to justify model predictions."
        )

    # 4. General Projects Intent
    if 'project' in query_lower:
        return (
            "Here are Elswin's key software and AI projects:\n\n"
            "- **AI-Powered Speech Analysis Tool**: Django & Random Forest model (98% accuracy) for speech disorder diagnosis using Librosa MFCC feature extraction.\n"
            "- **Vendor-IQ ESG Screening Platform**: Vendor ESG assessment system with automated risk scoring, scorecard generation, and historical performance tracking.\n"
            "- **AI-Driven Smart Agriculture System**: ESP32 IoT sensors + FastAPI + ML crop recommendations with SHAP & LIME Explainable AI.\n"
            "- **EnSoGo Sustainability Readiness Chatbot**: Node.js & React platform scoring organizational Scope 1/2/3 emissions using SAM BRD v2.0 framework."
        )

    # 5. Experience / Work Intent
    if any(k in query_lower for k in ['experience', 'work', 'job', 'role', 'internship', 'sam corporate']):
        return (
            "Elswin's professional experience encompasses full-stack software development and ESG solutions:\n\n"
            "- **Junior Developer** (Kakkanad, Kochi):\n"
            "  Transforms business requirements and BRDs into complete web applications using React, Next.js, TypeScript, Node.js, and PostgreSQL. Develops REST APIs, database models, and reporting workflows.\n\n"
            "- **Developer Intern (Full Stack)**: Designed and maintained ESG & sustainability platforms, carbon accounting modules, and client-facing web applications.\n\n"
            "- **ESG Presales Consultant (SAM Corporate)**: Developed Power BI dashboards, structured complex datasets, and conducted CDP analytics."
        )

    # 6. Education / Qualifications Intent
    if any(k in query_lower for k in ['education', 'degree', 'study', 'college', 'b.tech', 'university', 'gpa', 'cgpa']):
        return (
            "Elswin's educational background:\n\n"
            "- **B.Tech in Computer Science and Engineering**:\n"
            "  Adi Shankara Institute of Engineering and Technology, Kalady (2022 – 2026) | **CGPA: 8.58**\n\n"
            "- **Higher Secondary Education**:\n"
            "  Brahmanandodayam Kalady (2020 – 2022) | **96.41%**"
        )

    # 7. Default Cleaned Synthesis Fallback
    cleaned_items = []
    seen = set()
    for text in raw_texts:
        cleaned = re.sub(r'^(Projects:|Skills:|Education & Studies:|Education:|Professional Summary:|Contact Information:|Professional Experience:|Certifications:|\d+\.)\s*', '', text, flags=re.IGNORECASE).strip()
        if cleaned and cleaned not in seen:
            seen.add(cleaned)
            cleaned_items.append(cleaned)

    if not cleaned_items:
        return "This information is not available in Elswin's profile."

    formatted_bullets = "\n".join(f"- {item}" for item in cleaned_items[:4])
    return f"Here are the relevant details from Elswin's portfolio:\n\n{formatted_bullets}"


def generate_answer(query, results, model_name="qwen3:1.7b"):
    """
    Passes the question + top retrieved chunks to Qwen via Ollama (non-streaming).
    Falls back to smart RAG direct answer if Ollama is unreachable.
    """
    import urllib.request
    import urllib.error

    if not results:
        return "This information is not available in Elswin's profile."

    system_prompt, user_prompt = _build_prompts(query, results)

    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_prompt}
        ],
        "stream": False,
        "think": False,
        "options": {
            "temperature": 0.1,
            "num_predict": 700
        }
    }

    url = "http://localhost:11434/api/chat"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req, timeout=3) as response:
            body = response.read().decode("utf-8")
            data = json.loads(body)
            answer = data.get("message", {}).get("content", "").strip()
            answer = re.sub(r"<think>.*?</think>", "", answer, flags=re.DOTALL).strip()
            answer = answer.replace('\r\n', '\n').replace('\r', '\n')
            answer = "\n".join(line.rstrip() for line in answer.splitlines())
            if not answer:
                return _fallback_smart_answer(query, results)
            return format_answer_for_terminal(answer)
    except Exception as e:
        print(f"[Notice] Ollama unreachable on cloud server ({e}). Using direct RAG answer.")
        return _fallback_smart_answer(query, results)


def stream_answer(query, results, model_name="qwen3:1.7b"):
    """
    Generator yielding response tokens in real-time as SSE data events.
    Falls back to word-by-word streaming of direct RAG facts if Ollama is offline.
    """
    import urllib.request
    import urllib.error

    if not results:
        yield f"data: {json.dumps({'token': 'This information is not available in Elswin\'s profile.'})}\n\n"
        yield f"data: {json.dumps({'done': True})}\n\n"
        return

    system_prompt, user_prompt = _build_prompts(query, results)

    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_prompt}
        ],
        "stream": True,
        "think": False,
        "options": {
            "temperature": 0.1,
            "num_predict": 700
        }
    }

    url = "http://localhost:11434/api/chat"
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req, timeout=3) as response:
            in_think_block = False
            for line in response:
                if not line:
                    continue
                line_str = line.decode("utf-8").strip()
                if not line_str:
                    continue
                try:
                    data = json.loads(line_str)
                except Exception:
                    continue

                content = data.get("message", {}).get("content", "")

                if "<think>" in content:
                    in_think_block = True
                    content = re.sub(r"<think>.*", "", content)
                if "</think>" in content:
                    in_think_block = False
                    content = re.sub(r".*?", "", content)

                if in_think_block:
                    continue

                if content:
                    yield f"data: {json.dumps({'token': content})}\n\n"

                if data.get("done", False):
                    break

        yield f"data: {json.dumps({'done': True})}\n\n"
    except Exception as e:
        print(f"[Notice] Ollama unreachable on cloud server ({e}). Streaming direct RAG answer.")
        fallback_text = _fallback_smart_answer(query, results)
        words = fallback_text.split(" ")
        for i, word in enumerate(words):
            chunk = word if i == 0 else " " + word
            yield f"data: {json.dumps({'token': chunk})}\n\n"
        yield f"data: {json.dumps({'done': True})}\n\n"


def format_answer_for_terminal(answer, max_width=85):
    """
    Wraps text at max_width characters per line to avoid terminal horizontal staircasing / overflow.
    Preserves bullet points and block breaks cleanly.
    """
    import textwrap
    formatted_lines = []
    for line in answer.splitlines():
        line_str = line.strip()
        if not line_str:
            formatted_lines.append("")
        elif line_str.startswith(("-", "*", "1.", "2.", "3.", "4.", "5.")):
            indent = "  " if line.startswith("  ") else ""
            wrapped = textwrap.fill(line_str, width=max_width, initial_indent=indent, subsequent_indent=indent + "  ")
            formatted_lines.append(wrapped)
        else:
            wrapped = textwrap.fill(line_str, width=max_width)
            formatted_lines.append(wrapped)
    return "\n".join(formatted_lines)


def run_chat_retrieval(query=None):
    """
    Full RAG pipeline:
      Question → Embed (all-MiniLM) → Cosine Similarity → Top-K Chunks
      → Qwen synthesis → Final answer
    """
    searcher = VectorSearch()

    if not searcher.load_embeddings():
        return

    # Accept question from CLI argument or interactive input
    if query is None:
        if len(sys.argv) > 1:
            query = " ".join(sys.argv[1:]).strip()
        else:
            try:
                query = input("Question:\n").strip()
            except (EOFError, KeyboardInterrupt):
                print("\nExiting.")
                return

    if not query:
        print("Error: Question cannot be empty.")
        return

    print(f"\nQuestion:\n{query}\n")

    # Step 1: Retrieve top-K relevant chunks via all-MiniLM + cosine similarity
    results = searcher.search(query, top_k=5)

    if not results:
        print("Answer:\nThis information is not available in Elswin's profile.")
        return

    # Step 2: DEBUG — show raw retrieved chunks and similarity scores
    if DEBUG:
        print("-" * 60)
        print("DEBUG — Retrieved Chunks")
        print("-" * 60)
        for idx, (score, chunk) in enumerate(results, start=1):
            print(f"[{idx}] ID={chunk['id']}  Similarity={score:.4f}")
            print(f"     {chunk['text']}")
            print()
        print("-" * 60 + "\n")

    # Step 3: Pass question + retrieved chunks to Qwen for synthesis
    answer = generate_answer(query, results)

    if answer:
        formatted = format_answer_for_terminal(answer)
        sys.stdout.flush()
        print(f"Complete answer reconstructed from the streamed tokens:\n\n{formatted}\n")
        sys.stdout.flush()


if __name__ == "__main__":
    run_chat_retrieval()
