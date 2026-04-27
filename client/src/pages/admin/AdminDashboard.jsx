import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats } from '../../features/orders/orderSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { FiDollarSign, FiShoppingBag, FiUsers, FiClock } from 'react-icons/fi';

const StatCard = ({ icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { adminStats, loading } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchAdminStats()); }, [dispatch]);

  if (loading || !adminStats) return <Loader text="Loading dashboard..." />;

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const chartData  = adminStats.revenueByMonth?.map((d) => ({
    month:   monthNames[d._id.month - 1],
    revenue: parseFloat(d.revenue.toFixed(2)),
    orders:  d.count,
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/admin/products" className="btn-secondary text-sm">Manage Products</Link>
          <Link to="/admin/orders"   className="btn-primary  text-sm">Manage Orders</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FiDollarSign className="text-green-600 text-xl" />}  label="Total Revenue"  value={`$${adminStats.totalRevenue?.toFixed(2)}`}  color="bg-green-100" />
        <StatCard icon={<FiShoppingBag className="text-blue-600 text-xl" />}  label="Total Orders"   value={adminStats.totalOrders}                       color="bg-blue-100" />
        <StatCard icon={<FiUsers className="text-purple-600 text-xl" />}      label="Total Users"    value={adminStats.totalUsers}                        color="bg-purple-100" />
        <StatCard icon={<FiClock className="text-orange-600 text-xl" />}      label="Pending Orders" value={adminStats.pendingOrders}                     color="bg-orange-100" />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(val, name) => [
                  name === 'revenue' ? `$${val}` : val,
                  name === 'revenue' ? 'Revenue' : 'Orders',
                ]}
              />
              <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;