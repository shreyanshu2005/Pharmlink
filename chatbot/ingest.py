"""One-off script: read PDFs in ./data, chunk them, embed them, upsert to Pinecone.

Run:  python ingest.py
"""
import os
import sys

from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pinecone import Pinecone, ServerlessSpec

from rag import INDEX_NAME, get_embeddings

load_dotenv()
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
DIMENSION = 384  # all-MiniLM-L6-v2. Change this if you change EMBED_MODEL.


def ensure_index():
    pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
    if INDEX_NAME not in pc.list_indexes().names():
        print(f"Creating Pinecone index '{INDEX_NAME}' ...")
        pc.create_index(
            name=INDEX_NAME,
            dimension=DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(
                cloud=os.getenv("PINECONE_CLOUD", "aws"),
                region=os.getenv("PINECONE_REGION", "us-east-1"),
            ),
        )


def main():
    loader = DirectoryLoader(DATA_DIR, glob="**/*.pdf", loader_cls=PyPDFLoader)
    pages = loader.load()
    if not pages:
        sys.exit(f"No PDFs found in {DATA_DIR}. Add some and run again.")

    splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    chunks = splitter.split_documents(pages)
    print(f"Loaded {len(pages)} pages -> {len(chunks)} chunks")

    ensure_index()
    PineconeVectorStore.from_documents(chunks, get_embeddings(), index_name=INDEX_NAME)
    print("Done. The assistant can now answer from these documents.")


if __name__ == "__main__":
    main()
