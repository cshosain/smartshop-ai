from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import recommendations, sentiment

load_dotenv()

app = FastAPI(
    title="SmartShop ML Service",
    description="ML microservice — recommendations and sentiment analysis",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",
        "http://localhost:5173",
        "https://smartshop-api.onrender.com",
        "https://your-smartshop.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommendations.router, prefix="/recommend", tags=["Recommendations"])
app.include_router(sentiment.router,       prefix="/sentiment",  tags=["Sentiment"])

# Handles both GET and HEAD — HEAD is used by Render health checks
@app.api_route("/", methods=["GET", "HEAD"], tags=["Health"])
def root():
    return {
        "service": "SmartShop ML Service",
        "version": "1.0.0",
        "status":  "running 🤖",
        "docs":    "/docs",
    }

@app.api_route("/health", methods=["GET", "HEAD"], tags=["Health"])
def health():
    return {"status": "healthy ✅"}