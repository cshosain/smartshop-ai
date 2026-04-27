import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchCategories,
} from "../../features/products/productSlice";
import Loader from "../../components/common/Loader";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  brand: "",
  stock: "",
  tags: "",
  isFeatured: false,
};

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { items, loading, pages, categories } = useSelector((s) => s.products);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const LIMIT = 15;

  useEffect(() => {
    dispatch(fetchProducts({ limit: LIMIT, page: currentPage }));
    dispatch(fetchCategories());
  }, [dispatch, currentPage]);
  const openCreate = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };
  const openEdit = (p) => {
    setEditProduct(p);
    setForm({
      ...p,
      tags: p.tags?.join(", ") || "",
      price: p.price?.toString(),
      stock: p.stock?.toString(),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (editProduct) {
        await axiosInstance.put(`/products/${editProduct._id}`, payload);
        toast.success("Product updated");
      } else {
        await axiosInstance.post("/products", payload);
        toast.success("Product created");
      }
      setShowModal(false);
      dispatch(fetchProducts({ limit: 50 }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axiosInstance.delete(`/products/${id}`);
      toast.success("Product deleted");
      dispatch(fetchProducts({ limit: 50 }));
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <Loader text="Loading products..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Products ({items.length})
        </h1>
        <button
          onClick={openCreate}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  "Product",
                  "Category",
                  "Price",
                  "Stock",
                  "Rating",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          product.images?.[0] ||
                          `https://picsum.photos/seed/${product._id}/40/40`
                        }
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <p className="font-medium text-gray-800 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    ${product.price?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium ${product.stock > 10 ? "text-green-600" : "text-red-600"}`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    ⭐ {product.ratings?.toFixed(1)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {pages}
          </p>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg
                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
              // Show pages around current
              let p;
              if (pages <= 5) p = i + 1;
              else if (currentPage <= 3) p = i + 1;
              else if (currentPage >= pages - 2) p = pages - 4 + i;
              else p = currentPage - 2 + i;
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
                    currentPage === p
                      ? "bg-primary-600 text-white"
                      : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
              disabled={currentPage === pages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg
                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <FiX className="text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {[
                {
                  key: "name",
                  label: "Product Name",
                  type: "text",
                  required: true,
                },
                { key: "brand", label: "Brand", type: "text", required: true },
                {
                  key: "price",
                  label: "Price ($)",
                  type: "number",
                  required: true,
                },
                {
                  key: "stock",
                  label: "Stock",
                  type: "number",
                  required: true,
                },
                {
                  key: "tags",
                  label: "Tags (comma separated)",
                  type: "text",
                  required: false,
                },
              ].map(({ key, label, type, required }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    required={required}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="input-field text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="input-field text-sm"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="input-field text-sm resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm({ ...form, isFeatured: e.target.checked })
                  }
                  className="rounded text-primary-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  Featured Product
                </span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editProduct ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
