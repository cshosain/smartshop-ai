import ProductCard from './ProductCard';
import Loader from '../common/Loader';

const ProductGrid = ({ products, loading, emptyMessage = 'No products found' }) => {
  if (loading) return <Loader text="Loading products..." />;

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-4">🛍️</p>
        <p className="text-lg font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;