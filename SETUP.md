# Setup checklist (fill in your own keys)

No keys are included in this code. Copy each `.env.example` to `.env` and fill it in.

| File | Copy from | Keys to fill |
|---|---|---|
| `backend/.env` | `backend/.env.example` | MongoDB URI, JWT secret, admin login, Cloudinary, Razorpay, Google OAuth, Gmail app password |
| `frontend/.env` | `frontend/.env.example` | Razorpay **key id** (public), Google client id |
| `admin/.env` | `admin/.env.example` | nothing secret |
| `chatbot/.env` | `chatbot/.env.example` | HuggingFace token, Pinecone API key |
| `.env` (root, Docker only) | `.env.example` | same public values as frontend |

## Where to get each key
- **MongoDB**: Atlas free cluster -> Connect -> Drivers. Add `/pharmlink` after the host in the URI.
- **Cloudinary**: Dashboard -> cloud name, API key, API secret.
- **Razorpay**: Dashboard -> Test mode -> Settings -> API Keys.
- **Google** (console.cloud.google.com): create OAuth client (Web). Enable Google Calendar API.
  Add `http://localhost:5173` as an authorised JavaScript origin and your redirect URI.
  Put the client id in `backend/.env` AND `frontend/.env`. Then run `cd backend && node scripts/getRefreshToken.js` for `GOOGLE_REFRESH_TOKEN`.
- **Gmail app password**: Google Account -> Security -> 2-Step Verification -> App passwords.
- **HuggingFace**: Settings -> Access Tokens (read).
- **Pinecone**: Console -> API Keys. The index is created for you by `ingest.py`.

## Run (without Docker)
```bash
cd backend  && npm install && npm run server     # :4000
cd frontend && npm install && npm run dev        # :5173
cd admin    && npm install && npm run dev        # :5174
cd chatbot  && python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
# put PDFs in chatbot/data/, then:
python ingest.py && python app.py                # :5000
```

## Run (with Docker)
```bash
cp .env.example .env
docker compose up --build
docker compose run --rm chatbot python ingest.py
```

## Quick test order
1. `http://localhost:4000` shows "API WORKING" and `http://localhost:5000/health` returns ok.
2. Admin panel (`:5174`) -> log in with ADMIN_EMAIL / ADMIN_PASSWORD -> add a doctor.
3. Patient site (`:5173`) -> sign up -> book an appointment -> pay with Razorpay test card.
4. Click the chat button -> ask something your PDFs cover.
