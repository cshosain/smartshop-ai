import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiShoppingCart, FiStar, FiHeart } from "react-icons/fi";
import { addToCart, openCart } from "../../features/cart/cartSlice";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";

const SentimentBadge = ({ sentiment }) => {
  const config = {
    positive: { color: "bg-green-100 text-green-700", label: "😊 Positive" },
    neutral: { color: "bg-gray-100  text-gray-600", label: "😐 Neutral" },
    negative: { color: "bg-red-100   text-red-600", label: "😞 Negative" },
  };
  const c = config[sentiment] || config.neutral;
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.color}`}>
      {c.label}
    </span>
  );
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const handleAddToCart = (e) => {
    e.preventDefault(); // prevent navigating to product page
    dispatch(addToCart(product));
    dispatch(openCart());
    toast.success(`${product.name.substring(0, 20)}... added to cart`);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to use wishlist");
    try {
      await axiosInstance.post(`/users/wishlist/${product._id}`);
      toast.success("Wishlist updated");
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="group">
      <div className="card overflow-hidden hover:shadow-md transition-shadow duration-300">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          <img
            src={
              product.images?.[0] ||
              `https://picsum.photos/seed/${product._id}/400/400`
            }
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm
                       opacity-0 group-hover:opacity-100 transition-opacity duration-200
                       hover:text-red-500 text-gray-400"
          >
            <FiHeart className="text-sm" />
          </button>

          {/* Featured Badge */}
          {product.isFeatured && (
            <span
              className="absolute top-2 left-2 bg-accent-500 text-white text-xs
                             font-semibold px-2 py-0.5 rounded-full"
            >
              Featured
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3 space-y-2">
          {/* Category */}
          <p className="text-xs text-primary-600 font-medium uppercase tracking-wide">
            {product.category}
          </p>

          {/* Name */}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <FiStar className="text-accent-500 fill-accent-500 text-xs" />
            <span className="text-xs font-medium text-gray-700">
              {product.ratings?.toFixed(1) || "0.0"}
            </span>
            <span className="text-xs text-gray-400">
              ({product.numReviews || 0})
            </span>
          </div>

          {/* Sentiment badge — only shown if review data has it */}
          {product.recentSentiment && (
            <SentimentBadge sentiment={product.recentSentiment} />
          )}

          {/* Price + Cart Button */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-lg font-bold text-gray-900">
              ${product.price?.toFixed(2)}
            </p>
            {/* Hide Add to Cart for admin */}
            {!isAdmin && (
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700
                           text-white text-xs font-medium px-3 py-1.5 rounded-lg
                           transition-colors duration-200"
              >
                <FiShoppingCart className="text-xs" />
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
