# 🛒 SmartShop AI

An intelligent full-stack e-commerce platform powered by Machine Learning — featuring personalized product recommendations, sentiment analysis on reviews, NLP-enhanced search, and a real-time admin analytics dashboard.

![Stack](https://img.shields.io/badge/Stack-MERN-green)
![ML](https://img.shields.io/badge/ML-Python%20%7C%20FastAPI-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚀 Features

- 🔐 JWT Authentication with secure HttpOnly cookies & refresh tokens
- 🛍️ Full e-commerce flow — browse, cart, checkout, orders
- 🤖 ML-powered personalized recommendations (collaborative + content-based filtering)
- 💬 Sentiment analysis on product reviews (positive / neutral / negative)
- 🔍 NLP-enhanced product search
- 📊 Real-time admin analytics dashboard
- 🧠 AI Chatbot assistant (OpenAI / Gemini)
- ⚡ Redis caching for recommendation results
- 🐳 Fully Dockerized (3 services)

---

## 🏗️ Architecture
```
smartshop-ai/
├── client/          # React + Redux + Tailwind CSS
├── server/          # Node.js + Express + MongoDB
└── ml-service/      # Python + FastAPI (ML microservice)
```

---

## ⚙️ Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | React, Redux Toolkit, Tailwind CSS       |
| Backend     | Node.js, Express.js, MongoDB, Mongoose   |
| ML Service  | Python, FastAPI, Scikit-learn, Pandas    |
| Auth        | JWT (access + refresh tokens)            |
| Caching     | Redis                                    |
| DevOps      | Docker, Docker Compose                   |

---

## 🛠️ Local Setup

### Prerequisites
- Node.js v18+
- Python 3.10+
- MongoDB running locally
- Redis running locally

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/smartshop-ai.git
cd smartshop-ai
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env   # Fill in your values
npm run seed           # Seed 520+ products
npm run dev
```

### 3. ML service setup
```bash
cd ml-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Frontend setup
```bash
cd client
npm install
npm run dev
```

---

## 🔑 Test Credentials

| Role  | Email                    | Password     |
|-------|--------------------------|--------------|
| Admin | admin@smartshop.com      | admin123456  |
| User  | user@smartshop.com       | user123456   |

---

## 📡 API Endpoints

| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| POST   | /api/auth/register              | Register user                |
| POST   | /api/auth/login                 | Login user                   |
| GET    | /api/products                   | Get all products (paginated) |
| GET    | /api/products/:id/similar       | ML similar products          |
| GET    | /api/users/recommendations      | ML personalized picks        |
| POST   | /api/products/:id/reviews       | Post review + sentiment      |
| GET    | /api/orders/admin/stats         | Admin analytics              |

---

## 📄 License
MIT