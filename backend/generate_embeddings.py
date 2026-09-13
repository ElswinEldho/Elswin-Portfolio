import json
import logging
import os
import re
import sys
import warnings

# Suppress HuggingFace Hub unauthenticated / symlink warnings & logging
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["HF_HUB_DISABLE_IMPLICIT_TOKEN_WARNING"] = "1"
os.environ["HF_HUB_VERBOSITY"] = "error"
os.environ["TRANSFORMERS_VERBOSITY"] = "error"
warnings.filterwarnings("ignore")
logging.getLogger("sentence_transformers").setLevel(logging.ERROR)
logging.getLogger("huggingface_hub").setLevel(logging.ERROR)

# Lazy-loaded global model instance to avoid reloading
_MODEL_INSTANCE = None

def get_embedding_model(model_name="all-MiniLM-L6-v2"):
    """
    Reuse a single loaded model instance across multiple calls.
    Returns None if SentenceTransformer fails to load (e.g. Application Control policy block).
    """
    global _MODEL_INSTANCE
    if _MODEL_INSTANCE is None:
        try:
            from sentence_transformers import SentenceTransformer
            import io
            _stderr = sys.stderr
            sys.stderr = io.StringIO()  # suppress tqdm/progress output
            try:
                _MODEL_INSTANCE = SentenceTransformer(model_name)
            finally:
                sys.stderr = _stderr
        except Exception as e:
            print(f"Warning: Could not load SentenceTransformer model '{model_name}': {e}")
            return None
    return _MODEL_INSTANCE

def read_about_me(file_path):
    """
    Reads complete text from about-me.txt using UTF-8 encoding safely.
    Preserves original text content.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()

    return text

def create_small_meaningful_chunks(text, max_chunk_len=350, min_chunk_len=30):
    """
    Splits content into small, semantically meaningful chunks.
    Prefers splitting in order: Sections/headings -> Paragraphs -> Sentences -> Clauses.
    Avoids extremely tiny fragments by merging adjacent small items.
    Preserves chunk order and text content without loss or duplication.
    """
    if not text or not text.strip():
        return []

    # 1. Section split pattern based on major headers
    headers = [
        "Professional Summary", "Education", "Projects",
        "Professional Experience", "Internships", "Skills", "Certifications"
    ]
    header_pattern = r'(' + '|'.join(re.escape(h) for h in headers) + r')'
    parts = re.split(header_pattern, text, flags=re.IGNORECASE)

    raw_blocks = []
    if parts[0].strip():
        raw_blocks.append(parts[0].strip())

    i = 1
    while i < len(parts):
        h_name = parts[i].strip()
        body = parts[i+1].strip() if i + 1 < len(parts) else ""
        i += 2
        raw_blocks.append((h_name, body.strip()))

    chunks = []

    for block_entry in raw_blocks:
        if isinstance(block_entry, str):
            lines = [l.strip() for l in block_entry.split("\n") if l.strip()]
            if lines:
                clean_header = " ".join(" ".join(lines).split())
                if clean_header:
                    chunks.append(clean_header)
            continue

        h_name, body = block_entry
        h_lower = h_name.lower()

        if h_lower == "certifications":
            bullets = [b.strip() for b in re.split(r'[•]+', body) if b.strip()]
            for b in bullets:
                clean_b = " ".join(b.split())
                if clean_b:
                    chunks.append(f"{h_name}: {clean_b}")
        elif h_lower == "skills":
            items = re.split(r'(Technical Skills|Soft Skills|[•])', body, flags=re.IGNORECASE)
            sub_cat = f"{h_name}"
            k = 0
            while k < len(items):
                val = items[k].strip()
                if val.lower() in ["technical skills", "soft skills"]:
                    sub_cat = f"{h_name} - {val}"
                elif val and val != "•":
                    clean_val = " ".join(val.split())
                    if clean_val:
                        chunks.append(f"{sub_cat}: {clean_val}")
                k += 1
        else:
            paragraphs = [p.strip() for p in re.split(r'\n\s*\n', body) if p.strip()]

            for para in paragraphs:
                sub_items = re.split(r'(?=\b\d+\.\s+)', para)

                for item in sub_items:
                    item = item.strip()
                    if not item:
                        continue
                    clean_item = " ".join(item.split())

                    sentences = re.split(r'(?<=[.!?])\s+', clean_item)

                    current_chunk = ""
                    for sent in sentences:
                        sent = sent.strip()
                        if not sent:
                            continue

                        if len(sent) > max_chunk_len:
                            clauses = re.split(r'(?<=[;,])\s+', sent)
                            for clause in clauses:
                                clause = clause.strip()
                                if not clause:
                                    continue
                                if current_chunk and len(current_chunk) + len(clause) + 1 > max_chunk_len:
                                    chunks.append(f"{h_name}: {current_chunk.strip()}")
                                    current_chunk = clause
                                else:
                                    current_chunk = (current_chunk + " " + clause).strip() if current_chunk else clause
                        else:
                            if current_chunk and len(current_chunk) + len(sent) + 1 > max_chunk_len:
                                chunks.append(f"{h_name}: {current_chunk.strip()}")
                                current_chunk = sent
                            else:
                                current_chunk = (current_chunk + " " + sent).strip() if current_chunk else sent

                    if current_chunk:
                        chunks.append(f"{h_name}: {current_chunk.strip()}")

    # Post-process: merge tiny fragments (< min_chunk_len) into adjacent chunk if under max_chunk_len
    merged_chunks = []
    for c in chunks:
        if merged_chunks and (len(merged_chunks[-1]) < min_chunk_len or len(c) < min_chunk_len) and (len(merged_chunks[-1]) + len(c) + 1 <= max_chunk_len):
            merged_chunks[-1] = merged_chunks[-1] + " " + c
        else:
            merged_chunks.append(c)

    return merged_chunks

def generate_embeddings_for_chunks(chunks, model_name="all-MiniLM-L6-v2", batch_size=32):
    """
    Generates embedding vectors for chunks using batching with all-MiniLM model.
    """
    if not chunks:
        return []

    model = get_embedding_model(model_name)
    vectors = model.encode(chunks, batch_size=batch_size, show_progress_bar=False, convert_to_numpy=True)
    return vectors.tolist()

def process_and_save(file_path=None, output_path=None, model_name="all-MiniLM-L6-v2"):
    """
    Full embedding pipeline:
    about-me.txt -> Read file -> Split into smallest meaningful chunks -> Send each chunk to all-MiniLM -> Generate vectors -> Save to embeddings.json
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))
    if file_path is None:
        cand1 = os.path.join(base_dir, "..", "data", "about-me.txt")
        cand2 = os.path.join("data", "about-me.txt")
        file_path = cand1 if os.path.exists(cand1) else cand2

    if output_path is None:
        output_path = os.path.join(base_dir, "embeddings.json")

    print(f"Reading input file: {file_path}")
    text = read_about_me(file_path)
    char_count = len(text)
    print(f"Characters read: {char_count}")

    if not text.strip():
        print("Warning: Input file is empty.")
        data_to_save = {"embeddings": []}
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data_to_save, f, indent=2, ensure_ascii=False)
        print(f"Saved empty embeddings to: {output_path}")
        return data_to_save

    chunks = create_small_meaningful_chunks(text)
    chunk_count = len(chunks)
    print(f"Chunks created: {chunk_count}")

    print(f"Generating embeddings using model '{model_name}'...")
    vectors = generate_embeddings_for_chunks(chunks, model_name=model_name)
    embedding_count = len(vectors)
    print(f"Embeddings generated: {embedding_count}")

    embeddings_list = []
    for idx, (chunk_text, vec) in enumerate(zip(chunks, vectors)):
        embeddings_list.append({
            "id": idx,
            "text": chunk_text,
            "vector": [round(float(v), 6) for v in vec]
        })

    data_to_save = {
        "embeddings": embeddings_list
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data_to_save, f, indent=2, ensure_ascii=False)

    print(f"Output file location: {output_path}")
    return data_to_save

if __name__ == "__main__":
    process_and_save()
