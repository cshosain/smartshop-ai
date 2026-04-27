import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  fetchSimilarProducts,
  submitReview,
} from "../features/products/productSlice";
import { addToCart, openCart } from "../features/cart/cartSlice";
import ProductGrid from "../components/products/ProductGrid";
import Loader from "../components/common/Loader";
import { FiStar, FiShoppingCart, FiHeart, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

const StarRating = ({ rating, onRate }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onRate && onRate(star)}
        className={`text-xl transition-colors ${
          star <= rating ? "text-accent-500" : "text-gray-300"
        } ${onRate ? "hover:text-accent-400 cursor-pointer" : "cursor-default"}`}
      >
        ★
      </button>
    ))}
  </div>
);

const SentimentBadge = ({ sentiment }) => {
  const config = {
    positive: "bg-green-100 text-green-700",
    neutral: "bg-gray-100  text-gray-600",
    negative: "bg-red-100   text-red-600",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${config[sentiment] || config.neutral}`}
    >
      {sentiment === "positive"
        ? "😊 Positive"
        : sentiment === "negative"
          ? "😞 Negative"
          : "😐 Neutral"}
    </span>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    selectedProduct: product,
    similarProducts,
    loading,
  } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadReviews = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/products/${id}/reviews`);
      setReviews(data);
    } catch {
      /* silent */
    }
  });

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchSimilarProducts(id));
    window.scrollTo(0, 0);
    loadReviews().catch(() => {});
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (user?.role === "admin") return toast.error("Admins cannot purchase products");
    for (let i = 0; i < quantity; i++) dispatch(addToCart(product));
    dispatch(openCart());
    toast.success("Added to cart!");
  };

  const handleShowAdminMode = (e) => {
    if (user?.role === "admin") {
      toast("Admin Mode: Cannot add to cart", {
        icon: "⚠️",
        style: {
          border: "1px solid #f87171",
          padding: "8px 12px",
          color: "#b91c1c",
        },
      });
      e.target.disabled = true; // Disable the button on hover for admins
      e.stopPropagation();
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to review");
    if (user?.role === "admin") return toast.error("Admins cannot submit reviews");
    if (!review.comment.trim()) return toast.error("Please write a comment");
    setSubmitting(true);
    const result = await dispatch(submitReview({ id, reviewData: review }));
    if (submitReview.fulfilled.match(result)) {
      toast.success("Review submitted! Sentiment analyzed by AI ✨");
      setReview({ rating: 5, comment: "" });
      loadReviews();
    } else {
      toast.error("Failed to submit review");
    }
    setSubmitting(false);
  };

  if (loading || !product) return <Loader text="Loading product..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-gray-500
                                       hover:text-primary-600 text-sm mb-6 transition-colors"
      >
        <FiArrowLeft /> Back to Products
      </Link>

      {/* Product Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {/* Image */}
        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
          <img
            src={
              product.images?.[0] ||
              `https://picsum.photos/seed/${product._id}/600/600`
            }
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 leading-tight">
              {product.name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">Brand: {product.brand}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <StarRating rating={Math.round(product.ratings || 0)} />
            <span className="text-sm text-gray-600">
              {product.ratings?.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-gray-900">
            ${product.price?.toFixed(2)}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-sm">
            {product.description}
          </p>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}
            />
            <span
              className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Quantity + Cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600 font-bold"
              >
                −
              </button>
              <span className="px-4 py-2 font-medium text-gray-800 border-x border-gray-300">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="px-3 py-2 hover:bg-gray-100 transition-colors text-gray-600 font-bold"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              onMouseEnter={handleShowAdminMode}
              disabled={product.stock === 0 }
              className="btn-primary flex items-center gap-2 flex-1 justify-center py-2.5"
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button className="p-2.5 border border-gray-300 rounded-lg hover:border-red-400 hover:text-red-500 transition-colors">
              <FiHeart />
            </button>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Similar Products — ML Powered */}
      {similarProducts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
              🤖 AI Powered
            </span>
            <h2 className="text-xl font-bold text-gray-900">
              Similar Products
            </h2>
          </div>
          <ProductGrid products={similarProducts} loading={false} />
        </section>
      )}

      {/* Reviews Section */}
      <section className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Customer Reviews ({reviews.length})
        </h2>

        {/* Write Review */}
        {user ? (
          <form
            onSubmit={handleSubmitReview}
            className="bg-blue-50 rounded-xl p-5 mb-6 space-y-4"
          >
            <h3 className="font-semibold text-gray-800">Write a Review</h3>
            <div>
              <label className="text-sm text-gray-600 mb-1.5 block">
                Your Rating
              </label>
              <StarRating
                rating={review.rating}
                onRate={(r) => setReview({ ...review, rating: r })}
              />
            </div>
            <textarea
              rows={3}
              placeholder="Share your experience with this product..."
              value={review.comment}
              onChange={(e) =>
                setReview({ ...review, comment: e.target.value })
              }
              className="input-field resize-none text-sm"
            />
            <p className="text-xs text-blue-600">
              ✨ Your review will be analyzed by our AI sentiment engine
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-sm"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
            <p className="text-gray-500 text-sm">
              <Link
                to="/login"
                className="text-primary-600 font-medium hover:underline"
              >
                Login
              </Link>{" "}
              to write a review
            </p>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-sm">
                        {r.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {r.user?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <SentimentBadge sentiment={r.sentiment} />
                </div>
                <StarRating rating={r.rating} />
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetailPage;
