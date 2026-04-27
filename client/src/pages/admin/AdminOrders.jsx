import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Loader from "../../components/common/Loader";
import axiosInstance from "../../utils/axiosInstance";
import { fetchAdminStats } from "../../features/orders/orderSlice";
import toast from "react-hot-toast";
import { useState } from "react";

const statusConfig = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100   text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100  text-green-700",
  cancelled: "bg-red-100    text-red-700",
};

const AdminOrders = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const LIMIT = 15;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadOrders = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/orders?page=${page}&limit=${LIMIT}`,
      );
      // data might be an array (current) or paginated object
      // handle both cases gracefully
      if (Array.isArray(data)) {
        setOrders(data);
        setTotalPages(1);
        setTotalOrders(data.length);
      } else {
        setOrders(data.orders || []);
        setTotalPages(data.pages || 1);
        setTotalOrders(data.total || 0);
      }
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage]);

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      loadOrders();
      dispatch(fetchAdminStats());
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <Loader text="Loading orders..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Manage Orders ({orders.length})
      </h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Items",
                  "Total",
                  "Status",
                  "Date",
                  "Action",
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
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">
                      {order.user?.name}
                    </p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.items?.length}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    ${order.totalPrice?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${statusConfig[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1
                                 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {[
                        "pending",
                        "processing",
                        "shipped",
                        "delivered",
                        "cancelled",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
              <p className="text-sm text-gray-500">
                {totalOrders} total orders — Page {currentPage} of {totalPages}
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
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let p;
                  if (totalPages <= 5) p = i + 1;
                  else if (currentPage <= 3) p = i + 1;
                  else if (currentPage >= totalPages - 2)
                    p = totalPages - 4 + i;
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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg
                   hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
