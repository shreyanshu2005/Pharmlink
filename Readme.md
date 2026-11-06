<div align="center">

# 🏥 PharmLink

### Healthcare Services: book doctors, pay online, and ask an AI medical assistant

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-RAG%20Chatbot-000000?logo=flask&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)

[Live Demo](#-live-demo) · [Screenshots](#-screenshots) · [Features](#-features) · [Setup](#-local-setup) · [Deployment](#-deployment)

</div>

---

## 📖 Overview

**PharmLink** is a full-stack healthcare management platform with three web apps and an AI service:

| App | Who uses it | What it does |
|---|---|---|
| **Patient site** (`frontend/`) | Patients | Find doctors, book and pay for appointments, manage a profile, chat with the AI assistant |
| **Admin & Doctor panel** (`admin/`) | Admins and doctors | Manage doctors and appointments, view dashboards |
| **API** (`backend/`) | Both apps | Node/Express REST API with MongoDB, JWT auth, Razorpay and Google Calendar |
| **AI assistant** (`chatbot/`) | Patient site | Flask service that answers health questions from trusted medical PDFs (RAG) |


## 🌐 Live Demo

| Service | URL |
|---|---|
| Patient site | `https://YOUR-FRONTEND.vercel.app` |
| Admin / Doctor panel | `https://YOUR-ADMIN.vercel.app` |
| API | `https://YOUR-BACKEND.onrender.com` |

> ⏳ The API runs on a free hosting tier, so the **first request after a quiet period can take about 50 seconds** while the server wakes up.

---

## 📸 Screenshots

### Patient site

| Home | All Doctors |
|:---:|:---:|
| ![Home](docs/screenshots/home.png) | ![All Doctors](docs/screenshots/doctors.png) |

| Doctor Profile & Booking | Sign Up / Login |
|:---:|:---:|
| ![Appointment booking](docs/screenshots/appointment.png) | ![Login](docs/screenshots/login.png) |

| My Appointments & Payment | My Profile |
|:---:|:---:|
| ![My Appointments](docs/screenshots/my-appointments.png) | ![My Profile](docs/screenshots/my-profile.png) |

### AI Medical Assistant

| Chatbot |
|:---:|
| ![AI Chatbot](docs/screenshots/chatbot.png) |

### Admin panel

| Admin Dashboard | Add Doctor |
|:---:|:---:|
| ![Admin Dashboard](docs/screenshots/admin-dashboard.png) | ![Add Doctor](docs/screenshots/admin-add-doctor.png) |

| Doctors List | All Appointments |
|:---:|:---:|
| ![Doctors List](docs/screenshots/admin-doctors-list.png) | ![All Appointments](docs/screenshots/admin-appointments.png) |

### Doctor panel

| Doctor Dashboard | Doctor Appointments |
|:---:|:---:|
| ![Doctor Dashboard](docs/screenshots/doctor-dashboard.png) | ![Doctor Appointments](docs/screenshots/doctor-appointments.png) |

---

## ✨ Features

### 👤 Patients
- Sign up and log in with **email and password** or **Google Sign-In**
- Browse doctors and filter by **speciality**
- View a doctor's profile and **book an appointment slot**
- Pay online with **Razorpay**
- View and **cancel** your appointments
- Edit your profile and upload a profile photo
- Light / dark theme toggle
- Ask the **AI medical assistant** health questions

### 🩺 Doctors
- Separate doctor login
- Dashboard with appointment overview
- Mark appointments as **completed** or **cancelled**
- View and update their own profile

### 🛡️ Admins
- Secure admin login
- Dashboard with platform statistics
- **Add doctors** with a photo (stored on Cloudinary)
- Doctors list with an **availability toggle**
- View and cancel all appointments

### 📅 Integrations
- **Google Calendar** creates a **Google Meet** link for appointments
- **Razorpay** handles payment and verification
- **Cloudinary** stores doctor and user images
- **Nodemailer** (Gmail) for email

### 🤖 AI Medical Assistant (RAG)
- Answers come **only** from the medical PDFs in `chatbot/data/`
- Pipeline: question → embedding → **Pinecone** similarity search → LLM answer with **source citations**
- Says it has no verified answer, and suggests booking a doctor, when nothing relevant is found
- Shows an **emergency message** for urgent keywords (for example chest pain)
- Per-IP **rate limiting** and a message length cap
- It gives general information only. It does not diagnose or prescribe.

---

## 🏗️ Architecture

```mermaid
flowchart LR
    P[Patient site<br/>React + Vite] -->|REST| B[Backend API<br/>Node + Express]
    A[Admin / Doctor panel<br/>React + Vite] -->|REST| B
    P -->|questions| C[Chatbot<br/>Flask + LangChain]
    B --> M[(MongoDB Atlas)]
    B --> R[Razorpay]
    B --> G[Google Calendar / Meet]
    B --> CL[Cloudinary]
    C --> V[(Pinecone<br/>vector index)]
    C --> L[LLM API]
```

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend / Admin** | React 18, Vite, Tailwind CSS, React Router, Axios, React Toastify, `@react-oauth/google` |
| **Backend** | Node.js, Express, Mongoose, JWT, bcrypt, Multer, Nodemailer |
| **Database** | MongoDB (Atlas) |
| **Chatbot** | Flask, Gunicorn, LangChain, sentence-transformers (`all-MiniLM-L6-v2`), Pinecone, OpenAI-compatible LLM API |
| **Services** | Razorpay, Google OAuth and Calendar API, Cloudinary |
| **Deployment** | Vercel (frontend, admin), Render (backend, chatbot), Docker Compose |

---

## 📁 Project Structure

```
PharmLink/
├── backend/            # Express API (routes, controllers, models, middlewares, utils)
│   └── scripts/        # getRefreshToken.js: generates the Google refresh token
├── frontend/           # Patient website (Vite + React)
├── admin/              # Admin and doctor panel (Vite + React)
├── chatbot/            # Flask RAG service
│   ├── data/           # Medical PDFs used as the knowledge base
│   ├── ingest.py       # Loads PDFs into Pinecone (run once)
│   ├── rag.py          # Retrieval + answer generation
│   └── app.py          # Flask API
├── docs/screenshots/   # Images shown in this README
├── docker-compose.yml
└── SETUP.md
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- A MongoDB database (local or [Atlas](https://www.mongodb.com/atlas))
- Accounts and keys for: Cloudinary, Razorpay (test mode), Google Cloud (OAuth + Calendar API), Pinecone, and an LLM provider

### 1. Clone and install

```bash
git clone https://github.com/shreyanshu2005/Pharmlink.git
cd Pharmlink

cd backend  && npm install && cd ..
cd frontend && npm install && cd ..
cd admin    && npm install && cd ..
cd chatbot  && python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt && cd ..
```

### 2. Configure environment variables

Copy each `.env.example` to `.env` and fill it in. **Never commit `.env` files.**

<details>
<summary><b>backend/.env</b></summary>

```ini
PORT=4000
CURRENCY=INR
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/pharmlink
JWT_SECRET=a_long_random_string

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose_a_strong_password

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_SECRET_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_REFRESH_TOKEN=

EMAIL_USER=
EMAIL_PASSWORD=
```
</details>

<details>
<summary><b>frontend/.env</b> and <b>admin/.env</b></summary>

```ini
# frontend/.env
VITE_BACKEND_URL=http://localhost:4000
VITE_CHATBOT_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=
VITE_GOOGLE_CLIENT_ID=

# admin/.env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=₹
```
</details>

<details>
<summary><b>chatbot/.env</b></summary>

```ini
PINECONE_API_KEY=
PINECONE_INDEX_NAME=medical-chatbot-index
PINECONE_CLOUD=aws
PINECONE_REGION=us-east-1

# OpenAI-compatible LLM endpoint
LLM_API_KEY=
LLM_BASE_URL=
LLM_MODEL=

EMBED_MODEL=sentence-transformers/all-MiniLM-L6-v2
TOP_K=4
MIN_SCORE=0.30
ALLOWED_ORIGINS=http://localhost:5173
RATE_LIMIT_PER_MIN=20
PORT=5000
```
</details>

### 3. Get the Google refresh token (for Meet links)

```bash
cd backend
node scripts/getRefreshToken.js
```

Open the printed link, approve access, paste the code back into the terminal, and save the printed value as `GOOGLE_REFRESH_TOKEN`.

### 4. Load the medical PDFs (once)

```bash
cd chatbot
python ingest.py
```

### 5. Run everything

```bash
cd backend  && npm run server      # http://localhost:4000
cd frontend && npm run dev         # http://localhost:5173
cd admin    && npm run dev         # http://localhost:5174
cd chatbot  && python app.py       # http://localhost:5000
```

### Or run with Docker

```bash
cp .env.example .env
docker compose up --build
docker compose run --rm chatbot python ingest.py
```

### Quick test checklist
1. `http://localhost:4000` shows **API WORKING**, and `http://localhost:5000/health` returns ok.
2. Log in to the admin panel and add a doctor.
3. Sign up on the patient site and book an appointment.
4. Pay with a Razorpay **test** card.
5. Ask the chatbot something your PDFs cover.

---

## ☁️ Deployment

| Part | Host | Notes |
|---|---|---|
| Database | MongoDB Atlas | Create a database user and allow `0.0.0.0/0` under Network Access |
| Backend | Render (Web Service) | Add all backend variables. Do not set `PORT`. |
| Chatbot | Render (paid) or Hugging Face Space (Docker) | Needs more than 512 MB RAM |
| Frontend and Admin | Vercel (two projects) | Set Root Directory to `frontend` and `admin` |

**Important:**
- `VITE_*` variables are baked in at **build time**. Redeploy after changing them.
- Add your deployed frontend and admin URLs to `allowedOrigins` in `backend/server.js` (CORS).
- Add the frontend URL to **Authorized JavaScript origins** on your Google OAuth client.
- `GOOGLE_CLIENT_ID` must be identical in the backend and the frontend.

---

## 🔌 API Overview

<details>
<summary>Click to expand</summary>

**Users** `/api/user`
`POST /register` · `POST /login` · `POST /google-auth` · `GET /get-profile` · `POST /update-profile` · `POST /book-appointment` · `GET /appointments` · `POST /cancel-appointment` · `POST /payment-razorpay` · `POST /verifyRazorpay`

**Doctors** `/api/doctor`
`GET /list` · `POST /login` · `GET /appointments` · `POST /complete-appointment` · `POST /cancel-appointment` · `GET /dashboard` · `GET /profile` · `POST /update-profile`

**Admin** `/api/admin`
`POST /login` · `POST /add-doctor` · `GET /all-doctors` · `POST /change-availability` · `GET /appointments` · `POST /cancel-appointment` · `GET /dashboard`

</details>

---

## 🔐 Security notes

- Keep `.env` files out of Git. They are already in `.gitignore`.
- Use Razorpay **test** keys until you are ready to go live.
- Use a Gmail **App Password** for `EMAIL_PASSWORD`, never your real password.
- Rotate any key that was ever committed or shared.

---

## ⚠️ Disclaimer

The AI assistant provides general health information from the supplied documents and is **not a substitute for professional medical advice**. In an emergency, contact local emergency services immediately.

---

## 👨‍💻 Author

**Shreyanshu Kunwar**
GitHub: [@shreyanshu2005](https://github.com/shreyanshu2005)

---

<div align="center">
If you like this project, give it a ⭐
</div>
