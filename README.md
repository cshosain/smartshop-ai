# 🛒 SmartShop AI

An intelligent full-stack e-commerce platform powered by Machine Learning — featuring personalized product recommendations, sentiment analysis on reviews, NLP-enhanced search, and a real-time admin analytics dashboard.

![Stack](https://img.shields.io/badge/Stack-MERN-green)
![ML](https://img.shields.io/badge/ML-Python%20%7C%20FastAPI-blue)
![Node](https://img.shields.io/badge/Node.js-v18+-brightgreen)
![Python](https://img.shields.io/badge/Python-3.10+-yellow)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-In%20Development-orange)

---

## 📌 Project Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Express server, MongoDB models, JWT auth | ✅ Complete |
| Phase 2 | Product, Order, User API + DB seeding | ✅ Complete |
| Phase 3 | Python ML microservice (recommendations + sentiment) | ✅ Complete |
| Phase 4 | React frontend with Redux Toolkit + Tailwind CSS | 🔄 In Progress |
| Phase 5 | Advanced features (chatbot, pricing, analytics) | ⏳ Pending |
| Phase 6 | Docker + deployment | ⏳ Pending |

---

## 🚀 Features

### ✅ Implemented

#### Backend (Node.js + Express)
- 🔐 JWT Authentication with secure HttpOnly cookies and access + refresh token strategy
- 🛍️ Full product catalog with text search, filtering, sorting and pagination
- 📦 Complete order lifecycle — create, pay, track, update status, deliver
- ⭐ Product review system with ML sentiment analysis hook
- 👤 User profile management and wishlist toggle
- 🔒 Role-based access control — user and admin
- 🛡️ Reusable ObjectId validation middleware preventing server crashes
- 📊 Admin statistics with MongoDB revenue aggregation pipeline
- 🔗 Interaction tracking — view, wishlist, cart, purchase, review events
- 🌱 520+ seeded products across 8 categories with realistic data

#### ML Microservice (Python + FastAPI)
- 🤖 Sentiment analysis using VADER + TextBlob dual-signal weighted ensemble
- 🔍 Content-based filtering using TF-IDF vectorization + cosine similarity
- 👥 Collaborative filtering using custom SVD matrix factorization (scipy)
- 🧠 Hybrid recommender combining collaborative + content boost re-ranking
- ❄️ Cold start handling — featured products fallback for new users
- 📄 Auto-generated Swagger docs at /docs and ReDoc at /redoc
- ✅ ObjectId validation and proper 400/404 error responses

### 🔄 Coming Soon
- 🎨 React frontend with Redux Toolkit and Tailwind CSS
- 🧠 AI Chatbot assistant (OpenAI / Gemini API)
- ⚡ Redis caching for recommendation results
- 📈 Dynamic pricing suggestions based on demand trends
- 🐳 Full Docker deployment

---

## 🏗️ Architecture
```
smartshop-ai/
├── client/                    # React + Redux Toolkit + Tailwind CSS (Phase 4)
│
├── server/                    # Node.js + Express + MongoDB (✅ Complete)
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, logout, refresh token
│   │   ├── productController.js # CRUD, reviews, similar products
│   │   ├── orderController.js # Create, pay, status, admin stats
│   │   └── userController.js  # Profile, wishlist, recommendations
│   ├── middleware/
│   │   ├── authMiddleware.js  # protect, adminOnly, optionalProtect
│   │   ├── errorMiddleware.js # Global error handler and 404
│   │   └── validateObjectId.js # Reusable MongoDB ID validator
│   ├── models/
│   │   ├── User.js            # User schema with bcrypt hashing
│   │   ├── Product.js         # Product schema with text index
│   │   ├── Order.js           # Order schema with status lifecycle
│   │   ├── Review.js          # Review schema with sentiment fields
│   │   └── Interaction.js     # User behavior tracking for ML
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── generateToken.js   # Access + refresh token generation
│   ├── seeder.js              # Seeds 520 products and 2 test users
│   └── server.js              # App entry point
│
└── ml-service/                # Python + FastAPI (✅ Complete)
├── routers/
│   ├── sentiment.py       # VADER + TextBlob sentiment analysis
│   └── recommendations.py # TF-IDF, SVD, hybrid recommender
├── models/                # Saved model files (gitignored)
├── data/                  # Exported interaction data (gitignored)
└── main.py                # FastAPI app entry point

```
---

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React, Redux Toolkit, Tailwind CSS | User interface |
| Backend | Node.js, Express.js, MongoDB, Mongoose | REST API and business logic |
| ML Service | Python, FastAPI, Scikit-learn, SciPy | Recommendations and sentiment |
| Auth | JWT access + refresh tokens, HttpOnly cookies | Secure authentication |
| Caching | Redis | Recommendation result caching (Phase 5) |
| DevOps | Docker, Docker Compose | Containerization (Phase 6) |

---

## 🤖 ML Service Details

### Sentiment Analysis
Two models combined using weighted ensemble:

| Model | Weight | Strength |
|-------|--------|----------|
| VADER | 70% | Best for short review-style text |
| TextBlob | 30% | Grammar-based second opinion |
Score >= 0.05  → positive
Score <= -0.05 → negative
In between     → neutral

### Recommendation Engine
New user (no interactions)
↓
Cold start → featured products
Returning user
↓
Step 1: SVD collaborative filtering → 16 candidates
↓
Step 2: Content boost using purchase history similarity
↓
Step 3: Re-rank and return top 8 personalized products

| Method | Algorithm | Use Case |
|--------|-----------|----------|
| Content-based | TF-IDF + Cosine Similarity | Similar products |
| Collaborative | Custom SVD (scipy) | Personalized picks |
| Hybrid | CF candidates + Content boost | Best of both |

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

### 3. ML service setup
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate     # Windows
pip install -r requirements.txt
python -c "import nltk; nltk.download('vader_lexicon'); nltk.download('punkt'); nltk.download('stopwords')"
uvicorn main:app --reload --port 8000
```

### 4. Frontend setup (Phase 4)
```bash
cd client
npm install
npm run dev               # starts on http://localhost:5173
```

### 5. Run all three services together
Open three separate terminals:
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — ML Service
cd ml-service && venv\Scripts\activate && uvicorn main:app --reload --port 8000

# Terminal 3 — Frontend (Phase 4)
cd client && npm run dev
```

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smartshop.com | admin123456 |
| User | user@smartshop.com | user123456 |

---

## 📡 API Reference

### Auth Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login and receive tokens | Public |
| POST | /api/auth/logout | Clear token cookies | Public |
| POST | /api/auth/refresh | Refresh access token silently | Public |

### Product Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/products | Get all products with search, filter, sort, paginate | Public |
| GET | /api/products/:id | Get single product + track view interaction | Public |
| GET | /api/products/categories/all | Get all distinct categories | Public |
| GET | /api/products/:id/similar | ML content-based similar products | Public |
| GET | /api/products/:id/reviews | Get all reviews for a product | Public |
| POST | /api/products | Create new product | Admin |
| PUT | /api/products/:id | Update product | Admin |
| DELETE | /api/products/:id | Delete product | Admin |
| POST | /api/products/:id/reviews | Post review with auto sentiment analysis | User |

### Order Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/orders | Create new order | User |
| GET | /api/orders/myorders | Get current user orders | User |
| GET | /api/orders/:id | Get order by ID | User |
| PUT | /api/orders/:id/pay | Mark order as paid | User |
| GET | /api/orders | Get all orders | Admin |
| PUT | /api/orders/:id/status | Update order status | Admin |
| GET | /api/orders/admin/stats | Revenue and analytics stats | Admin |

### User Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/users/profile | Get current user profile | User |
| PUT | /api/users/profile | Update name, avatar, password | User |
| POST | /api/users/wishlist/:productId | Toggle product in wishlist | User |
| GET | /api/users/recommendations | ML hybrid personalized picks | User |
| GET | /api/users | Get all users | Admin |
| DELETE | /api/users/:id | Delete user | Admin |

### ML Service Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /recommend/similar/:productId | Content-based similar products |
| GET | /recommend/user/:userId | Hybrid personalized recommendations |
| GET | /recommend/health | ML service health and DB stats |
| POST | /sentiment/analyze | Single review sentiment analysis |
| POST | /sentiment/analyze-batch | Batch review sentiment analysis |
| GET | /sentiment/health | Sentiment service health |

---

## 🗃️ Database Models

### User
_id, name, email, password (bcrypt hashed),
role (user/admin), avatar, wishlist[], timestamps

### Product
_id, name, description, price, category, brand,
images[], stock, ratings, numReviews,
tags[], isFeatured, timestamps
Text index on: name, description, tags

### Order
_id, user, items[], shippingAddress,
paymentMethod, totalPrice, isPaid, paidAt,
isDelivered, deliveredAt, status, timestamps

### Review
_id, user, product, rating, comment,
sentiment (positive/neutral/negative),
sentimentScore, timestamps

### Interaction
_id, user, product,
type (view/cart/purchase/wishlist/review),
rating, createdAt
Compound index on: user + product
This model feeds the entire ML recommendation engine

---

## 🔐 Security

- Passwords hashed with bcryptjs (salt rounds: 12)
- JWT stored in HttpOnly cookies — never localStorage
- Access token expires in 15 minutes
- Refresh token expires in 7 days — silent re-authentication
- Helmet.js sets secure HTTP response headers
- Rate limiting: 100 requests per 15 minutes per IP
- CORS restricted to frontend origin only
- MongoDB ObjectId validation on all ID parameters
- Role-based middleware: protect, adminOnly, optionalProtect
- Server never crashes on invalid or malformed IDs

---

## 🧠 ML Service Notes

- scikit-surprise was replaced with scipy.sparse.linalg.svds
- scikit-surprise fails to compile on Windows with latest NumPy (Cython issue)
- scipy SVD is the same algorithm — pure Python, no C compilation needed
- All ML packages are unpinned to always use latest compatible versions
- NLTK vader_lexicon must be downloaded once before first run
- ML service has graceful fallback in Node.js — shop works even if ML is down

---

## 📄 License
MIT