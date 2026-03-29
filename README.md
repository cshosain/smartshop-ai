# 🛒 SmartShop AI

An intelligent full-stack e-commerce platform powered by Machine Learning — featuring personalized product recommendations, sentiment analysis on reviews, NLP-enhanced search, and a real-time admin analytics dashboard.

![Stack](https://img.shields.io/badge/Stack-MERN-green)
![ML](https://img.shields.io/badge/ML-Python%20%7C%20FastAPI-blue)
![Node](https://img.shields.io/badge/Node.js-v18+-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-In%20Development-orange)

---

## 📌 Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Express server, MongoDB models, JWT auth | ✅ Complete |
| Phase 2 | Product, Order, User API + DB seeding | ✅ Complete |
| Phase 3 | Python ML microservice (recommendations + sentiment) | 🔄 In Progress |
| Phase 4 | React frontend with Redux + Tailwind CSS | ⏳ Pending |
| Phase 5 | Advanced features (chatbot, pricing, analytics) | ⏳ Pending |
| Phase 6 | Docker + deployment | ⏳ Pending |

---

## 🚀 Features

### ✅ Implemented
- 🔐 JWT Authentication with secure HttpOnly cookies and refresh tokens
- 🛍️ Full product catalog with search, filter, sort and pagination
- 📦 Complete order lifecycle — create, pay, track, deliver
- ⭐ Product review system with ML sentiment hook
- 👤 User profile and wishlist management
- 🔒 Role-based access control (user / admin)
- 🛡️ Reusable ObjectId validation middleware
- 📊 Admin statistics with revenue aggregation
- 🌱 520+ seeded products across 8 categories

### 🔄 Coming Soon
- 🤖 ML-powered personalized recommendations
- 💬 Sentiment analysis on product reviews
- 🔍 NLP-enhanced product search
- 🧠 AI Chatbot assistant
- ⚡ Redis caching for recommendations
- 🐳 Full Docker deployment

---

## 🏗️ Architecture
```
smartshop-ai/
├── client/            # React + Redux Toolkit + Tailwind CSS  (Phase 4)
├── server/            # Node.js + Express + MongoDB           (✅ Complete)
│   ├── config/        # Database connection
│   ├── controllers/   # Route handler logic
│   ├── middleware/    # Auth, error handling, validation
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routers
│   └── utils/         # Token generation helpers
└── ml-service/        # Python + FastAPI ML microservice      (Phase 3)
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Redux Toolkit, Tailwind CSS |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| ML Service | Python, FastAPI, Scikit-learn, Pandas |
| Auth | JWT (access + refresh tokens, HttpOnly cookies) |
| Caching | Redis (Phase 5) |
| DevOps | Docker, Docker Compose (Phase 6) |

---

## 🛠️ Local Setup

### Prerequisites
- Node.js v18+
- Python 3.10+
- MongoDB running locally
- Redis running locally (Phase 5)

### 1. Clone the repo
```bash
git clone https://github.com/cshosain/smartshop-ai.git
cd smartshop-ai
```

### 2. Backend setup
```bash
cd server
npm install
cp .env.example .env      # fill in your values
npm run seed              # seeds 520+ products and 2 test accounts
npm run dev               # starts on http://localhost:5000
```

### 3. ML service setup (Phase 3)
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Frontend setup (Phase 4)
```bash
cd client
npm install
npm run dev               # starts on http://localhost:5173
```

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smartshop.com | admin123456 |
| User | user@smartshop.com | user123456 |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |
| POST | /api/auth/logout | Logout user | Public |
| POST | /api/auth/refresh | Refresh access token | Public |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/products | Get all products (search, filter, sort, paginate) | Public |
| GET | /api/products/:id | Get single product | Public |
| GET | /api/products/categories/all | Get all categories | Public |
| GET | /api/products/:id/similar | ML similar products | Public |
| GET | /api/products/:id/reviews | Get product reviews | Public |
| POST | /api/products | Create product | Admin |
| PUT | /api/products/:id | Update product | Admin |
| DELETE | /api/products/:id | Delete product | Admin |
| POST | /api/products/:id/reviews | Post review + sentiment | User |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/orders | Create new order | User |
| GET | /api/orders/myorders | Get my orders | User |
| GET | /api/orders/:id | Get order by ID | User |
| PUT | /api/orders/:id/pay | Mark order as paid | User |
| GET | /api/orders | Get all orders | Admin |
| PUT | /api/orders/:id/status | Update order status | Admin |
| GET | /api/orders/admin/stats | Revenue and analytics | Admin |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/users/profile | Get my profile | User |
| PUT | /api/users/profile | Update my profile | User |
| POST | /api/users/wishlist/:productId | Toggle wishlist | User |
| GET | /api/users/recommendations | ML personalized picks | User |
| GET | /api/users | Get all users | Admin |
| DELETE | /api/users/:id | Delete user | Admin |

---

## 🗃️ Database Models

### User
```
_id, name, email, password (hashed), role, avatar, wishlist[], timestamps
```

### Product
```
_id, name, description, price, category, brand, images[],
stock, ratings, numReviews, tags[], isFeatured, timestamps
```

### Order
```
_id, user, items[], shippingAddress, paymentMethod,
totalPrice, isPaid, paidAt, isDelivered, deliveredAt, status, timestamps
```

### Review
```
_id, user, product, rating, comment,
sentiment, sentimentScore, timestamps
```

### Interaction
```
_id, user, product, type (view/cart/purchase/wishlist/review),
rating, createdAt
```
> The Interaction model is the foundation of the ML recommendation engine.

---

## 🔐 Security

- Passwords hashed with bcryptjs (salt rounds: 12)
- JWT stored in HttpOnly cookies (not localStorage)
- Access token expires in 15 minutes
- Refresh token expires in 7 days
- Helmet.js sets secure HTTP headers
- Rate limiting: 100 requests per 15 minutes per IP
- CORS restricted to frontend origin
- MongoDB ObjectId validation on all ID params
- Admin-only routes protected by role middleware

---

## 📄 License
MIT