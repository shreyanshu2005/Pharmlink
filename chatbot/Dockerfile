FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HOME=/models
WORKDIR /app

# CPU-only PyTorch (about 200 MB instead of 2 GB+ with CUDA libraries)
RUN pip install torch --index-url https://download.pytorch.org/whl/cpu

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

# One worker: the embedding model is loaded once, and the rate limiter is in-memory.
CMD ["gunicorn", "-b", "0.0.0.0:5000", "--workers", "1", "--threads", "4", "--timeout", "180", "app:app"]
