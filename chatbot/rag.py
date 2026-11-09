"""Retrieval-augmented generation core for the PharmLink assistant (low-memory version).

Flow: question -> Pinecone-hosted embedding -> Pinecone similarity search ->
prompt with the retrieved passages -> LLM (OpenAI-compatible API) -> answer + sources.

No PyTorch / sentence-transformers: embeddings are computed by Pinecone, so the
service fits comfortably in 512 MB of RAM (Render free tier).
"""
import os
from functools import lru_cache

from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone

load_dotenv()

EMBED_MODEL = os.getenv("EMBED_MODEL", "multilingual-e5-large")  # 1024 dims, hosted by Pinecone
LLM_MODEL = os.getenv("LLM_MODEL", "openai/gpt-oss-20b")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "pharmlink-e5")
TOP_K = int(os.getenv("TOP_K", "4"))
# e5 cosine scores are compressed (unrelated text still scores ~0.7), so the
# threshold is higher than it was for MiniLM. Tune between 0.75 and 0.85.
MIN_SCORE = float(os.getenv("MIN_SCORE", "0.80"))

SYSTEM_PROMPT = (
    "You are PharmLink's medical information assistant. Answer the user's "
    "question using ONLY the context passages below. If the context does not "
    "contain the answer, say you don't have verified information on that and "
    "suggest booking an appointment with a doctor. Be clear and concise, use "
    "plain language, and never diagnose or prescribe. Do not mention the word "
    "'context' in your answer.\n\nContext:\n{context}"
)

NO_ANSWER = (
    "I couldn't find verified information about that in my medical sources. "
    "Please book an appointment with a doctor on PharmLink for advice that fits you."
)


@lru_cache(maxsize=1)
def get_pc():
    return Pinecone(api_key=os.environ["PINECONE_API_KEY"])


@lru_cache(maxsize=1)
def get_index():
    return get_pc().Index(INDEX_NAME)


@lru_cache(maxsize=1)
def get_llm():
    return OpenAI(api_key=os.getenv("LLM_API_KEY"), base_url=os.getenv("LLM_BASE_URL"))


def embed(texts, input_type):
    """Embed texts with Pinecone's hosted model. input_type: 'query' or 'passage'."""
    res = get_pc().inference.embed(
        model=EMBED_MODEL,
        inputs=list(texts),
        parameters={"input_type": input_type, "truncate": "END"},
    )
    return [item["values"] for item in res]


def retrieve(question: str):
    """Return [(metadata, score)] above MIN_SCORE (cosine: higher is closer)."""
    vector = embed([question], "query")[0]
    res = get_index().query(vector=vector, top_k=TOP_K, include_metadata=True)
    return [(dict(m.metadata or {}), m.score) for m in res.matches if m.score >= MIN_SCORE]


def _sources(metas):
    seen, out = set(), []
    for meta in metas:
        name = os.path.basename(str(meta.get("source", "unknown")))
        page = meta.get("page")
        page = int(page) if isinstance(page, (int, float)) else None
        key = (name, page)
        if key not in seen:
            seen.add(key)
            out.append({"source": name, "page": page})
    return out


def answer(question: str, history=None):
    hits = retrieve(question)
    if not hits:
        return {"answer": NO_ANSWER, "sources": []}

    metas = [meta for meta, _ in hits]
    context = "\n\n".join(m.get("text", "") for m in metas)

    messages = [{"role": "system", "content": SYSTEM_PROMPT.format(context=context)}]
    for turn in (history or [])[-6:]:  # short memory for follow-up questions
        if turn.get("role") in ("user", "assistant") and turn.get("content"):
            messages.append({"role": turn["role"], "content": str(turn["content"])[:1000]})
    messages.append({"role": "user", "content": question})

    reply = get_llm().chat.completions.create(
        model=LLM_MODEL, messages=messages, max_tokens=512, temperature=0.2
    )
    return {"answer": reply.choices[0].message.content.strip(), "sources": _sources(metas)}