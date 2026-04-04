from fastapi import APIRouter, HTTPException
from pymongo import MongoClient
from bson import ObjectId
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds
import pandas as pd
import numpy as np
import os
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

# ─────────────────────────────────────────────
# MongoDB connection
# ─────────────────────────────────────────────
client = MongoClient(os.getenv("MONGO_URI"))
db     = client["test"]

# ─────────────────────────────────────────────
# DATA LOADERS
# ─────────────────────────────────────────────

def get_interactions_df():
    """Load all interactions from MongoDB into a DataFrame."""
    interactions = list(db.interactions.find({}))
    if not interactions:
        return pd.DataFrame(columns=["user", "product", "score"])

    score_map = {
        "view":     1.0,
        "wishlist": 2.0,
        "cart":     3.0,
        "review":   4.0,
        "purchase": 5.0,
    }

    rows = []
    # For reviews, we can use the rating as the score if available, otherwise fallback to a default score for "review" type.
    for i in interactions:
        score = score_map.get(i.get("type", "view"), 1.0)
        if i.get("type") == "review" and i.get("rating"):
            score = float(i["rating"])
        rows.append({
            "user":    str(i["user"]),
            "product": str(i["product"]),
            "score":   score,
        })

    df = pd.DataFrame(rows)
    # Keep max score per user-product pair
    df = df.groupby(["user", "product"], as_index=False)["score"].max()
    return df


def get_products_df():
    """Load all products from MongoDB into a DataFrame."""
    products = list(db.products.find({}, {
        "_id": 1, "name": 1, "description": 1,
        "category": 1, "brand": 1, "tags": 1, "isFeatured": 1,
    }))

    if not products:
        return pd.DataFrame()

    rows = []
    for p in products:
        rows.append({
            "product_id":  str(p["_id"]),
            "name":        p.get("name", ""),
            "description": p.get("description", "")[:300],
            "category":    p.get("category", ""),
            "brand":       p.get("brand", ""),
            "tags":        " ".join(p.get("tags", [])),
            "isFeatured":  p.get("isFeatured", False),
        })

    return pd.DataFrame(rows)


# ─────────────────────────────────────────────
# CONTENT-BASED FILTERING — TF-IDF
# ─────────────────────────────────────────────

def build_tfidf_matrix(products_df: pd.DataFrame):
    """Build TF-IDF matrix from product text corpus."""
    products_df = products_df.copy()
    products_df["corpus"] = (
        products_df["name"]        + " " +
        products_df["category"]    + " " +
        products_df["brand"]       + " " +
        products_df["tags"]        + " " +
        products_df["description"]
    )
    tfidf  = TfidfVectorizer(stop_words="english", max_features=5000)
    matrix = tfidf.fit_transform(products_df["corpus"])
    return matrix


def get_similar_products(product_id: str, top_n: int = 6):
    """Return top N similar products using cosine similarity on TF-IDF."""
    products_df = get_products_df()

    if products_df.empty:
        return []

    if product_id not in products_df["product_id"].values:
        return []

    matrix = build_tfidf_matrix(products_df)
    idx    = products_df[products_df["product_id"] == product_id].index[0]

    sim_scores      = cosine_similarity(matrix[idx], matrix).flatten()
    sim_scores[idx] = 0  # exclude itself

    top_indices = np.argsort(sim_scores)[::-1][:top_n]
    return products_df.iloc[top_indices]["product_id"].tolist()


# ─────────────────────────────────────────────
# COLLABORATIVE FILTERING — CUSTOM SVD
# ─────────────────────────────────────────────

def build_user_item_matrix(interactions_df: pd.DataFrame):
    """
    Build a user-item matrix from interactions.
    Rows = users, Columns = products, Values = interaction scores.
    """
    if interactions_df.empty or len(interactions_df) < 5:
        return None, None, None

    # Create index mappings
    users    = interactions_df["user"].unique().tolist()
    products = interactions_df["product"].unique().tolist()

    user_idx    = {u: i for i, u in enumerate(users)}
    product_idx = {p: i for i, p in enumerate(products)}

    rows = interactions_df["user"].map(user_idx).values
    cols = interactions_df["product"].map(product_idx).values
    data = interactions_df["score"].values

    matrix = csr_matrix(
        (data, (rows, cols)),
        shape=(len(users), len(products)),
        dtype=np.float32,
    )

    return matrix, users, products


def get_collab_recommendations(user_id: str, top_n: int = 8):
    """
    Collaborative filtering using SVD matrix factorization.
    Predicts scores for unvisited products and returns top N.
    """
    interactions_df = get_interactions_df()
    products_df     = get_products_df()

    if products_df.empty:
        return []

    matrix, users, products = build_user_item_matrix(interactions_df)

    if matrix is None:
        return []

    # User must exist in interaction history
    if user_id not in users:
        return []

    # Number of factors — must be less than min(rows, cols)
    n_factors = min(20, matrix.shape[0] - 1, matrix.shape[1] - 1)
    if n_factors < 1:
        return []

    # SVD decomposition: matrix ≈ U * Σ * Vt
    U, sigma, Vt = svds(matrix.astype(float), k=n_factors)
    sigma_diag   = np.diag(sigma)

    # Reconstruct full predicted rating matrix
    predicted = np.dot(np.dot(U, sigma_diag), Vt)

    user_idx_map = {u: i for i, u in enumerate(users)}
    user_row     = predicted[user_idx_map[user_id]]

    # Products this user already interacted with
    already_seen = set(
        interactions_df[interactions_df["user"] == user_id]["product"].tolist()
    )

    # Map predicted scores back to product IDs
    product_scores = []
    for i, pid in enumerate(products):
        if pid not in already_seen:
            product_scores.append((pid, user_row[i]))

    product_scores.sort(key=lambda x: x[1], reverse=True)
    return [p[0] for p in product_scores[:top_n]]


# ─────────────────────────────────────────────
# HYBRID RECOMMENDER
# ─────────────────────────────────────────────

def get_hybrid_recommendations(user_id: str, top_n: int = 8):
    """
    Hybrid approach:
    1. Collaborative filtering candidates via SVD
    2. Re-rank using content similarity to user purchase history
    3. Cold start fallback for new users
    """
    interactions_df   = get_interactions_df()
    products_df       = get_products_df()

    if products_df.empty:
        return []

    user_interactions = interactions_df[interactions_df["user"] == user_id]

    # ── Cold start: new user with no interactions ──
    if user_interactions.empty:
        featured = products_df[
            products_df["isFeatured"] == True
        ]["product_id"].tolist()
        return featured[:top_n] if featured else products_df["product_id"].tolist()[:top_n]

    # ── Collaborative filtering candidates ──
    collab_ids = get_collab_recommendations(user_id, top_n * 2)

    if not collab_ids:
        # Not enough global data — pure content-based fallback
        top_product = user_interactions.sort_values(
            "score", ascending=False
        ).iloc[0]["product"]
        return get_similar_products(top_product, top_n)

    # ── Content boost re-ranking ──
    high_scored = user_interactions[
        user_interactions["score"] >= 4
    ]["product"].tolist()

    if not high_scored:
        return collab_ids[:top_n]

    boost_scores = {pid: 0 for pid in collab_ids}
    for ref_pid in high_scored[:3]:
        similar = get_similar_products(ref_pid, top_n=20)
        for pid in similar:
            if pid in boost_scores:
                boost_scores[pid] += 1

    reranked = sorted(
        collab_ids,
        key=lambda x: boost_scores.get(x, 0),
        reverse=True,
    )
    return reranked[:top_n]


# ─────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────

@router.get("/similar/{product_id}")
def similar_products(product_id: str, top_n: int = 6):
    """Content-based similar products using TF-IDF cosine similarity."""
    print(db.products.count_documents({}))
    try:
        exists = db.products.find_one({"_id": ObjectId(product_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid product ID format")

    if not exists:
        raise HTTPException(status_code=404, detail="Product not found")

    results = get_similar_products(product_id, top_n)

    return {
        "product_id":  product_id,
        "product_ids": results,
        "count":       len(results),
        "method":      "content-based (TF-IDF + cosine similarity)",
    }


@router.get("/user/{user_id}")
def user_recommendations(user_id: str, top_n: int = 8):
    """Hybrid personalized recommendations for a user."""
    try:
        exists = db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    if not exists:
        raise HTTPException(status_code=404, detail="User not found")

    interactions_df   = get_interactions_df()
    user_interactions = interactions_df[interactions_df["user"] == user_id]
    has_interactions  = not user_interactions.empty

    results = get_hybrid_recommendations(user_id, top_n)

    return {
        "user_id":     user_id,
        "product_ids": results,
        "count":       len(results),
        "has_history": has_interactions,
        "method":      "hybrid (SVD collaborative + content boost)"
                       if has_interactions else "cold-start (featured products)",
    }


@router.get("/health")
def recommendations_health():
    """Health check with DB stats."""
    try:
        interaction_count = db.interactions.count_documents({})
        product_count     = db.products.count_documents({})
        user_count        = db.users.count_documents({})

        df    = get_interactions_df()
        ready = len(df) >= 5

        return {
            "status":              "Recommendations service running ✅",
            "products_in_db":      product_count,
            "users_in_db":         user_count,
            "interactions_in_db":  interaction_count,
            "model_ready":         ready,
            "svd_implementation":  "scipy.sparse.linalg.svds",
            "note":                "Need at least 5 interactions to train SVD"
                                   if not ready else "SVD model ready to train",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))