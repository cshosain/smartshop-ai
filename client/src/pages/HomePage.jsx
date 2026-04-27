import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCategories, fetchRecommendations } from '../features/products/productSlice';
import ProductGrid from '../components/products/ProductGrid';
import { FiArrowRight, FiZap, FiStar, FiShield } from 'react-icons/fi';

const CategoryCard = ({ name }) => {
  const icons = {
    Electronics: '💻', Clothing: '👗', Books: '📚',
    'Home & Kitchen': '🏠', Sports: '⚽', Beauty: '💄',
    Toys: '🧸', Automotive: '🚗',
  };
  return (
    <Link
      to={`/products?category=${name}`}
      className="card p-4 text-center hover:shadow-md hover:border-primary-200
                 border border-transparent transition-all duration-200 group"
    >
      <div className="text-3xl mb-2">{icons[name] || '📦'}</div>
      <p className="text-sm font-medium text-gray-700 group-hover:text-primary-600">
        {name}
      </p>
    </Link>
  );
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { items, recommendations, categories, loading } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, sortBy: 'ratings', order: 'desc' }));
    dispatch(fetchCategories());
    if (user) dispatch(fetchRecommendations());
  }, [dispatch, user]);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm
                            text-white text-sm px-3 py-1.5 rounded-full mb-6 font-medium">
              <FiZap className="text-accent-400" />
              Powered by Machine Learning
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Shop Smarter with
              <span className="text-accent-400"> AI-Powered</span>
              <br />Recommendations
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Discover products tailored just for you. Our ML engine learns
              your preferences and delivers personalized picks every time you visit.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="bg-white text-primary-700 font-semibold
                                              px-6 py-3 rounded-xl hover:bg-blue-50
                                              transition-colors flex items-center gap-2">
                Shop Now <FiArrowRight />
              </Link>
              {!user && (
                <Link to="/register" className="bg-white/20 backdrop-blur-sm text-white
                                                font-semibold px-6 py-3 rounded-xl
                                                hover:bg-white/30 transition-colors">
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <FiZap className="text-primary-600" />, title: 'AI Recommendations', desc: 'Personalized just for you' },
              { icon: <FiStar className="text-accent-500" />, title: 'Sentiment Analysis', desc: 'Smart review insights' },
              { icon: <FiShield className="text-green-500" />, title: 'Secure Shopping', desc: 'JWT auth + encrypted data' },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
            View all <FiArrowRight className="text-xs" />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => <CategoryCard key={cat} name={cat} />)}
        </div>
      </section>

      {/* ML Recommendations */}
      {user && recommendations.length > 0 && (
        <section className="bg-gradient-to-r from-primary-50 to-blue-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FiZap className="text-primary-600" />
                  <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                    AI Powered
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Personalized picks based on your browsing and purchase history
                </p>
              </div>
              <Link to="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                See more <FiArrowRight className="text-xs" />
              </Link>
            </div>
            <ProductGrid products={recommendations} loading={false} />
          </div>
        </section>
      )}

      {/* Top Rated Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Rated Products</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
            View all <FiArrowRight className="text-xs" />
          </Link>
        </div>
        <ProductGrid products={items} loading={loading} />
      </section>
    </div>
  );
};

export default HomePage;