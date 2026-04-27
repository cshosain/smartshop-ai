import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../features/orders/orderSlice';
import Loader from '../components/common/Loader';
import { FiPackage } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const statusConfig = {
  pending:    { color: 'bg-yellow-100 text-yellow-700', label: 'Pending'    },
  processing: { color: 'bg-blue-100   text-blue-700',   label: 'Processing' },
  shipped:    { color: 'bg-purple-100 text-purple-700', label: 'Shipped'    },
  delivered:  { color: 'bg-green-100  text-green-700',  label: 'Delivered'  },
  cancelled:  { color: 'bg-red-100    text-red-700',    label: 'Cancelled'  },
};

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  if (loading) return <Loader text="Loading orders..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <FiPackage className="text-5xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">You have no orders yet</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status] || statusConfig.pending;
            return (
              <div key={order._id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                    <p className="font-mono text-sm font-medium text-gray-700">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* Items Preview */}
                <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                  {order.items?.map((item, i) => (
                    <img
                      key={i}
                      src={item.image || `https://picsum.photos/seed/${item.product}/60/60`}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                    />
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div className="flex gap-4 text-gray-500">
                    <span>{order.items?.length} item(s)</span>
                    <span>·</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-bold text-gray-900">${order.totalPrice?.toFixed(2)}</p>
                    {order.isPaid && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Paid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;