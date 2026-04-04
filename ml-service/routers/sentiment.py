from fastapi import APIRouter
from pydantic import BaseModel
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from textblob import TextBlob

router = APIRouter()
sia    = SentimentIntensityAnalyzer()

class TextInput(BaseModel):
    text: str

# ─────────────────────────────────────────────
# POST /sentiment/analyze
# ─────────────────────────────────────────────
@router.post("/analyze")
def analyze_sentiment(payload: TextInput):
    text = payload.text.strip()

    if not text:
        return {
            "sentiment": "neutral",
            "score":     0.0,
            "vader":     {},
            "blob_polarity": 0.0,
        }

    # VADER — best for short review-style text
    vader_scores = sia.polarity_scores(text)
    compound     = vader_scores["compound"]

    # TextBlob — second signal for better accuracy
    blob_polarity = TextBlob(text).sentiment.polarity

    # Weighted combination (VADER is more reliable for reviews)
    final_score = (compound * 0.7) + (blob_polarity * 0.3)

    if final_score >= 0.05:
        sentiment = "positive"
    elif final_score <= -0.05:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return {
        "sentiment":      sentiment,
        "score":          round(final_score, 4),
        "vader":          vader_scores,
        "blob_polarity":  round(blob_polarity, 4),
    }

# ─────────────────────────────────────────────
# POST /sentiment/analyze-batch
# Analyze multiple reviews at once
# ─────────────────────────────────────────────
class BatchInput(BaseModel):
    texts: list[str]

@router.post("/analyze-batch")
def analyze_batch(payload: BatchInput):
    results = []
    for text in payload.texts:
        vader_scores  = sia.polarity_scores(text)
        compound      = vader_scores["compound"]
        blob_polarity = TextBlob(text).sentiment.polarity
        final_score   = (compound * 0.7) + (blob_polarity * 0.3)

        if final_score >= 0.05:
            sentiment = "positive"
        elif final_score <= -0.05:
            sentiment = "negative"
        else:
            sentiment = "neutral"

        results.append({
            "text":      text[:80],
            "sentiment": sentiment,
            "score":     round(final_score, 4),
        })

    return { "results": results, "count": len(results) }

@router.get("/health")
def sentiment_health():
    return { "status": "Sentiment service running ✅" }