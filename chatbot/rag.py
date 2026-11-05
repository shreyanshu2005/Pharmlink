
"""Retrieval-augmented generation core for the PharmLink assistant.

Flow: question -> embed -> Pinecone similarity search -> prompt with the
retrieved passages -> HuggingFace chat model -> answer + sources.
"""
import os
from functools import lru_cache

from dotenv import load_dotenv
from openai import OpenAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore

load_dotenv()

EMBED_MODEL = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "medical-chatbot-index")
TOP_K = int(os.getenv("TOP_K", "4"))
MIN_SCORE = float(os.getenv("MIN_SCORE", "0.30"))

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
def get_embeddings():
    return HuggingFaceEmbeddings(model_name=EMBED_MODEL)


@lru_cache(maxsize=1)
def get_vectorstore():
    # PINECONE_API_KEY is read from the environment by the Pinecone client.
    return PineconeVectorStore(index_name=INDEX_NAME, embedding=get_embeddings())


@lru_cache(maxsize=1)
def get_llm():
    return OpenAI(api_key=os.getenv("LLM_API_KEY"), base_url=os.getenv("LLM_BASE_URL"))


def retrieve(question: str):
    """Return [(Document, score)] above MIN_SCORE (cosine: higher is closer)."""
    results = get_vectorstore().similarity_search_with_score(question, k=TOP_K)
    return [(doc, score) for doc, score in results if score >= MIN_SCORE]


def _sources(docs):
    seen, out = set(), []
    for doc in docs:
        name = os.path.basename(doc.metadata.get("source", "unknown"))
        page = doc.metadata.get("page")
        page = int(page) + 1 if isinstance(page, (int, float)) else None
        key = (name, page)
        if key not in seen:
            seen.add(key)
            out.append({"source": name, "page": page})
    return out


def answer(question: str, history=None):
    hits = retrieve(question)
    if not hits:
        return {"answer": NO_ANSWER, "sources": []}

    docs = [doc for doc, _ in hits]
    context = "\n\n".join(d.page_content for d in docs)

    messages = [{"role": "system", "content": SYSTEM_PROMPT.format(context=context)}]
    for turn in (history or [])[-6:]:  # short memory for follow-up questions
        if turn.get("role") in ("user", "assistant") and turn.get("content"):
            messages.append({"role": turn["role"], "content": str(turn["content"])[:1000]})
    messages.append({"role": "user", "content": question})

    reply = get_llm().chat.completions.create(
        model=LLM_MODEL, messages=messages, max_tokens=512, temperature=0.2
    )
    return {"answer": reply.choices[0].message.content.strip(), "sources": _sources(docs)}