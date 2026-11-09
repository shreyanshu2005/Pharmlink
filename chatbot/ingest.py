"""One-off script (run on your own computer): read PDFs in ./data, chunk them,
embed them with Pinecone's hosted model, and upsert them to a Pinecone index.

Run:  python ingest.py
"""
import glob
import hashlib
import os
import sys
import time

from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from pypdf import PdfReader

import rag

load_dotenv()
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
DIMENSION = 1024  # multilingual-e5-large. Change this if you change EMBED_MODEL.
CHUNK_SIZE, OVERLAP = 800, 100


def chunk(text):
    text = " ".join(text.split())
    out, i = [], 0
    while i < len(text):
        out.append(text[i : i + CHUNK_SIZE])
        i += CHUNK_SIZE - OVERLAP
    return out


def ensure_index():
    pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
    if rag.INDEX_NAME not in pc.list_indexes().names():
        print(f"Creating Pinecone index '{rag.INDEX_NAME}' ({DIMENSION} dims) ...")
        pc.create_index(
            name=rag.INDEX_NAME,
            dimension=DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(
                cloud=os.getenv("PINECONE_CLOUD", "aws"),
                region=os.getenv("PINECONE_REGION", "us-east-1"),
            ),
        )
        while not pc.describe_index(rag.INDEX_NAME).status["ready"]:
            time.sleep(1)
    else:
        dim = pc.describe_index(rag.INDEX_NAME).dimension
        if dim != DIMENSION:
            sys.exit(f"Index '{rag.INDEX_NAME}' has {dim} dimensions but {DIMENSION} are needed. "
                     "Use a new PINECONE_INDEX_NAME (or delete the old index) and run again.")


def main():
    records = []  # (id, text, source, page)
    for path in sorted(glob.glob(os.path.join(DATA_DIR, "**", "*.pdf"), recursive=True)):
        name = os.path.basename(path)
        for page_no, page in enumerate(PdfReader(path).pages, start=1):
            for n, piece in enumerate(chunk(page.extract_text() or "")):
                rid = hashlib.md5(f"{name}:{page_no}:{n}".encode()).hexdigest()
                records.append((rid, piece, name, page_no))
    if not records:
        sys.exit(f"No PDF text found in {DATA_DIR}. Add some PDFs and run again.")
    print(f"{len(records)} chunks to embed")

    ensure_index()
    index = rag.get_index()
    for i in range(0, len(records), 64):
        batch = records[i : i + 64]
        vectors = rag.embed([r[1] for r in batch], "passage")
        index.upsert(vectors=[
            {"id": r[0], "values": v, "metadata": {"text": r[1], "source": r[2], "page": r[3]}}
            for r, v in zip(batch, vectors)
        ])
        print(f"  upserted {min(i + 64, len(records))}/{len(records)}")
    print("Done. The assistant can now answer from these documents.")


if __name__ == "__main__":
    main()