import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../features/products/productSlice';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import useDebounce from '../hooks/useDebounce';
import { FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductsPage = () => {
  const dispatch       = useDispatch();
  const [searchParams] = useSearchParams();
  const { items, loading, pages, total, page: currentPage } = useSelector((s) => s.products);
  const { categories } = useSelector((s) => s.products);
  const [showFilters,  setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    keyword:  '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sortBy:   'createdAt',
    order:    'desc',
    page:     1,
  });

  const debouncedKeyword = useDebounce(filters.keyword, 500);
  const debouncedMinPrice   = useDebounce(filters.minPrice, 500);
  const debouncedMaxPrice   = useDebounce(filters.maxPrice, 500);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({
      keyword: debouncedKeyword,
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      category: filters.category,
      sortBy: filters.sortBy,
      order: filters.order,
      page: filters.page,

      limit:   12,
    }));
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    dispatch,
    debouncedKeyword,
    debouncedMinPrice,
    debouncedMaxPrice,
    filters.category,
    filters.sortBy,
    filters.order,
    filters.page,
  ]);

  const goToPage = (p) => {
    if (p < 1 || p > pages) return;
    setFilters((prev) => ({ ...prev, page: p }));
  };

  // Build visible page numbers — show max 5 pages around current
  const getPageNumbers = () => {
    if (pages <= 7) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }
    const current = filters.page;
    const delta   = 2;
    const range   = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(pages - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2)      range.unshift('...');
    if (current + delta < pages - 1) range.push('...');

    return [1, ...range, pages];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          {total > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              Showing {Math.min((filters.page - 1) * 12 + 1, total)}–{Math.min(filters.page * 12, total)} of {total} products
              {filters.category && ` in ${filters.category}`}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 btn-secondary text-sm"
        >
          {showFilters ? <FiX /> : <FiFilter />}
          Filters
        </button>
      </div>

      <div className="flex gap-6">

        {/* Sidebar Filters — Desktop */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              setFilters={setFilters}
              categories={categories}
            />
          </div>
        </aside>

        {/* Mobile Filters Overlay */}
        {showFilters && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setShowFilters(false)}
          >
            <div
              className="absolute left-0 top-16 h-full w-72 bg-white p-4 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ProductFilters
                filters={filters}
                setFilters={(f) => { setFilters(f)}}
                categories={categories}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={items} loading={loading} />

          {/* ── Pagination ── */}
          {pages > 1 && !loading && (
            <div className="mt-8 flex flex-col items-center gap-3">

              {/* Page info */}
              <p className="text-sm text-gray-500">
                Page {filters.page} of {pages}
              </p>

              {/* Page buttons */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center">

                {/* Prev */}
                <button
                  onClick={() => goToPage(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium
                             border border-gray-300 bg-white text-gray-600
                             hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                             transition-colors"
                >
                  <FiChevronLeft className="text-xs" /> Prev
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((p, idx) =>
                  p === '...' ? (
                    <span key={`dots-${idx}`} className="px-2 py-2 text-gray-400 text-sm select-none">
                      •••
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors
                        ${filters.page === p
                          ? 'bg-primary-600 text-white shadow-sm'
                          : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => goToPage(filters.page + 1)}
                  disabled={filters.page === pages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium
                             border border-gray-300 bg-white text-gray-600
                             hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                             transition-colors"
                >
                  Next <FiChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;