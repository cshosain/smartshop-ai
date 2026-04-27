import { FiSearch, FiX } from 'react-icons/fi';

const ProductFilters = ({ filters, setFilters, categories }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ keyword: '', category: '', minPrice: '', maxPrice: '', sortBy: 'createdAt', order: 'desc', page: 1 });
  };

  const hasActiveFilters = filters.keyword || filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <FiX className="text-xs" /> Clear all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search products..."
          value={filters.keyword}
          onChange={(e) => handleChange('keyword', e.target.value)}
          className="input-field pl-9 text-sm"
        />
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="input-field text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="input-field text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="input-field text-sm"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1.5">
          Sort By
        </label>
        <select
          value={`${filters.sortBy}-${filters.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-');
            setFilters((prev) => ({ ...prev, sortBy, order, page: 1 }));
          }}
          className="input-field text-sm"
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="ratings-desc">Highest Rated</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;