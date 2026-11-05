
# PharmLink - Healthcare Services

## Overview

**PharmLink** is a cutting-edge Healthcare Management System built on the **MERN stack** to optimize hospital operations and improve patient care. It offers an intuitive and scalable platform to streamline tasks like appointment scheduling, patient record management, real-time doctor-patient communication, seamless integration with Google Calendar for automated scheduling, secure payment processing via Razorpay, and now includes an **AI-powered medical assistant** for instant medical query support.

# DEMO

[![Watch the Demo](https://img.youtube.com/vi/v4q3-HdnE0g/0.jpg)](https://youtu.be/v4q3-HdnE0g)

## 🧠 AI-Powered Chatbot Feature

An intelligent medical assistant built with **Flask**, **LangChain**, **HuggingFace**, and **Pinecone** that provides instant answers to health-related queries by retrieving verified information from trusted **medical PDFs**.

- 📚 Uses **vector similarity search** over authenticated medical documents.
- 🤖 Integrates seamlessly into the patient dashboard.
- 🗣️ Provides conversational responses to patient health-related queries.
- 🔐 Ensures data privacy and secure query handling.

[![Click Here](https://img.shields.io/badge/Watch%20Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=__IsLxIoxu8)

---

## Deployment

Add your own deployed URLs here (for example Vercel for `frontend` and `admin`, Render/Railway for `backend` and `chatbot`).

---

## Features

### 🔒 Secure & Scalable
- **User Authentication**: Role-based login for **patients, doctors, and admins**.
- **Secure Data Storage**: Encrypted and privacy-compliant record handling.

### 📅 Smart Scheduling
- **Appointment Management**: Book/reschedule/cancel with ease.
- **Google Calendar Sync**: Auto-create **Google Meet links**.

### 💳 Payment Integration
- **Razorpay Support**: Secure transactions and receipt generation.

### 💬 Real-Time Communication
- **Doctor-Patient Messaging**: In-app real-time chat.
- **AI Chatbot Support**: Instant answers to medical queries.

### 🧠 AI Medical Assistant (NEW)
- **Built with Flask + LangChain + Pinecone + HuggingFace**.
- **Retrieves data** from medical PDFs using vector similarity.
- **Secure, accurate, and reliable** responses to health queries.

### 🏥 Admin & Doctor Dashboards
- Full control over appointments, users, earnings, and data.

---

## Tech Stack

- **Frontend**: React.js, Redux
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Chatbot**: Flask, LangChain, HuggingFace Transformers, Pinecone
- **Authentication**: JWT
- **Integrations**: Google Calendar API, Razorpay

---

## Pages & Panels

<details>
  <summary>Click to expand</summary>

### 🏠 Home Page
- Doctor search, featured doctors, and site info.

### 🩺 All Doctors Page
- Filterable doctor listing.

### 📄 About Page
- Project vision, benefits, and footer links.

### 📞 Contact Page
- Office info and job opportunities.

### 📅 Doctor Appointment Page
- Detailed profiles, booking options, and secure payments.

### 👤 User Profile
- Appointment history, personal info editing, and logout.

### 🗄️ Admin Panel
- Add/edit doctors, manage appointments and users.

### 🩺 Doctor Dashboard
- Track appointments, earnings, and update profile.

</details>

---

## 💳 Payment Integration
- 💵 Cash or 💳 Razorpay
- 🔒 Secure checkout and invoicing

---

## Installation & Setup

### Prerequisites
- **Node.js**, **MongoDB**, **Git**
- **Google API Credentials** (Calendar)
- **Razorpay API Keys**
- **Python 3.9+** (for AI assistant)
- **HuggingFace Access Token**, **Pinecone API Key**

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/PharmLink-Hospital_Management_System.git
   cd PharmLink-Hospital_Management_System
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install

   # Admin Panel
   cd ../admin && npm install

   # AI Chatbot (Python Backend)
   cd ../chatbot && pip install -r requirements.txt
   ```

3. **Set environment variables**

   - `backend/.env`
     ```ini
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     GOOGLE_REDIRECT_URI=your_google_redirect_uri
     RAZORPAY_KEY_ID=your_razorpay_key_id
     RAZORPAY_KEY_SECRET=your_razorpay_key_secret
     GOOGLE_REFRESH_TOKEN=your_google_refresh_token   # run: node scripts/getRefreshToken.js
     CLOUDINARY_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_SECRET_KEY=your_cloudinary_secret
     ADMIN_EMAIL=admin@example.com
     ADMIN_PASSWORD=choose_a_strong_password
     EMAIL_USER=your_gmail_address
     EMAIL_PASSWORD=your_gmail_app_password
     CURRENCY=INR
     PORT=4000
     ```

   - `admin/.env`
     ```ini
     VITE_BACKEND_URL=http://localhost:4000
     VITE_CURRENCY=₹
     ```

   - `chatbot/.env`
     ```ini
     HF_TOKEN=your_huggingface_token
     PINECONE_API_KEY=your_pinecone_api_key
     PINECONE_INDEX_NAME=medical-chatbot-index
     PINECONE_CLOUD=aws
     PINECONE_REGION=us-east-1
     ```
     See `chatbot/.env.example` for all options. (`PINECONE_ENVIRONMENT=gcp-starter` is retired; Pinecone now uses serverless cloud + region.)

   - `frontend/.env` (see `frontend/.env.example`)
     ```ini
     VITE_BACKEND_URL=http://localhost:4000
     VITE_CHATBOT_URL=http://localhost:5000
     ```

4. **Load the medical documents into Pinecone (once)**
   ```bash
   # Put trusted medical PDFs in chatbot/data/, then:
   cd chatbot && python ingest.py
   ```
   This splits the PDFs into chunks, embeds them with `sentence-transformers/all-MiniLM-L6-v2`
   and stores them in your Pinecone index (it creates the index if it doesn't exist).

5. **Run the project**
   ```bash
   # Start Node Backend
   cd backend && npm run server

   # Start Admin Panel
   cd ../admin && npm run dev

   # Start Frontend
   cd ../frontend && npm run dev

   # Start AI Chatbot Flask App (http://localhost:5000)
   cd ../chatbot && python app.py
   ```

   The chat button appears at the bottom-right of the patient site once a user is logged in.

### How the AI assistant works (RAG)

```
question -> embed (MiniLM) -> Pinecone top-k search -> prompt with retrieved passages
         -> HuggingFace chat model -> answer + source file/page
```
- Low-relevance searches return a "no verified information" reply instead of a guess.
- Emergency phrases (e.g. chest pain) skip the model and show emergency numbers.
- Questions are length-limited and rate-limited per IP, and question text is not logged.

---

## Run with Docker (optional)

One command starts MongoDB, the backend, patient site, admin panel and AI chatbot.

```bash
cp .env.example .env                 # public VITE_* values for the frontend/admin build
# create backend/.env and chatbot/.env as described above
docker compose up --build
docker compose run --rm chatbot python ingest.py   # once, after adding PDFs to chatbot/data/
```

| App | URL |
|---|---|
| Patient site | http://localhost:5173 |
| Admin / doctor panel | http://localhost:5174 |
| Backend API | http://localhost:4000 |
| AI chatbot | http://localhost:5000/health |

- MongoDB runs in a container (`mongo` service) and its data lives in the `mongo_data` volume.
  To use MongoDB Atlas instead, remove the `mongo` service and the `MONGODB_URI` override in `docker-compose.yml`.
- `VITE_*` values are baked in at build time. If you change them, run `docker compose up --build` again.
- Stop with `docker compose down` (add `-v` to also delete the database and the cached model).

---

## Contributing

We welcome your contributions!  
Just fork, branch, commit your changes, and open a pull request 🚀

---

## Contact & Support

For queries or collaboration, reach out to **[Abhinav Tirole](mailto:tiroleabhinav@gmail.com)**.

---

## License

Licensed under the **MIT License**.
